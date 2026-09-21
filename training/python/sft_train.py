#!/usr/bin/env python3
"""Supervised fine-tuning of the compiled-plan chat profile (PLAN.md T5b, D8).

The script reads the committed trainer view (``training/data/all-books.jsonl``,
chat profile ``compiled-plan-chat-1``), drops the folder ids of the validation
slice (``training/data/validation-slice.json``, decision D11), optionally keeps
only the overfit subset (``training/overfit/overfit-subset.json``, task T5a),
renders every row with the base model's own chat template, and trains with the
recipe of decision D8: BF16, AdamW, gradient clipping 1.0, cosine schedule with
warmup, effective batch 32 (per-device 8 x gradient accumulation 4), seed 3407,
PyTorch SDPA attention, and the ``transformers`` Trainer.

Sequence handling follows D7: length 4096, no packing, no truncation. A row
longer than the limit aborts the run with the offending folders listed instead
of being clipped.

The loss comes from :func:`chat_mask.render_and_mask`: assistant tokens and the
assistant closing turn token carry their ids, every other token is ``-100``,
and right padding is masked as well, so nothing but the assistant targets
contributes to the objective.

Artifacts written under ``--output-dir`` (default
``training/checkpoints/<experiment>``):

* ``train-log.jsonl`` - one JSON object per log record with the keys ``step``,
  ``epoch``, ``loss``, ``learning_rate``, ``tokens_seen`` (input tokens
  consumed, counted from the batches actually collated), ``wall_clock_s`` and
  the memory columns of the guard (``mem_available_gib``, ``cuda_free_gib``,
  ``cuda_peak_gib``, ``cuda_reserved_gib``, ``rss_gib``), so a configuration
  mistake surfaces in the record instead of in a frozen machine.
* ``run-manifest.json`` - the DS009 run manifest (base model and tokenizer
  revisions and hashes, dataset snapshot id and file hashes, chat profile id
  and system prompt hash, sequence length, packing policy, batch parameters,
  optimizer, learning rate and schedule, warmup, precision, clipping, method
  and LoRA parameters, seeds, epochs, token budget, checkpoint and evaluation
  cadence, environment manifest hash), plus the realized counters after the run.
* the checkpoints and the final model, written by the Trainer.

Memory safety (DS009). The GB10 shares one pool of about 119 GiB between the
CPU and the GPU, the kernel OOM killer does not account device allocations, and
an exhausted pool freezes the whole desktop instead of failing the run. Every
run therefore declares a device-memory budget: the process caps its own
allocator at ``--memory-fraction`` of device memory (0.75 by default) and the
memory guard stops the run at a step boundary, after saving a checkpoint, when
the available memory falls below ``--memory-floor-gb`` (16 GiB by default), so
``--resume auto`` continues the run on a machine that is still usable. A run
stopped this way exits with code 3 and writes ``status: stopped_for_memory`` to
the run manifest. ``--gradient-checkpointing`` trades compute for activations
when the batch approaches the budget.

Typical runs::

    # pipeline check without training: tokenizes, prints counts, writes nothing
    python training/python/sft_train.py --experiment exp-001-overfit \
        --subset training/overfit/overfit-subset.json --dry-run

    # the overfit integration run of T5 (D8)
    python training/python/sft_train.py --experiment exp-001-overfit \
        --subset training/overfit/overfit-subset.json --epochs 20 --lr 2e-5

    # the full run of D8/T8
    python training/python/sft_train.py --experiment exp-002-sft-lr2e-5 \
        --epochs 3 --save-steps 27

Relative paths are resolved against the repository root, so the commands work
from any working directory. ``--dry-run`` writes nothing at all, including
``--token-counts-out``.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import sys
import time
from datetime import datetime, timezone
from importlib.metadata import PackageNotFoundError, version
from pathlib import Path

import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    Trainer,
    TrainerCallback,
    TrainingArguments,
)

sys.path.insert(0, str(Path(__file__).resolve().parent))

from chat_mask import LOSS_IGNORE_INDEX, render_and_mask  # noqa: E402  (path set above)

REPO_ROOT = Path(__file__).resolve().parents[2]

DEFAULT_BASE_MODEL = "training/models/qwen2.5-coder-0.5b-instruct"
DEFAULT_DATA = "training/data/all-books.jsonl"
DEFAULT_VALIDATION_SLICE = "training/data/validation-slice.json"
DEFAULT_MODEL_MANIFEST = "training/environment/base-model.json"
DEFAULT_EXPORT_MANIFEST = "training/data/export-manifest.json"
DEFAULT_ENVIRONMENT_MANIFEST = "training/environment/environment-manifest.json"

#: LoRA targets of D8: every attention and MLP projection of the Qwen2 blocks.
LORA_TARGET_MODULES = (
    "q_proj",
    "k_proj",
    "v_proj",
    "o_proj",
    "gate_proj",
    "up_proj",
    "down_proj",
)

#: Tokenizer files hashed into the run manifest (those that exist).
TOKENIZER_FILES = (
    "tokenizer.json",
    "tokenizer_config.json",
    "vocab.json",
    "merges.txt",
    "special_tokens_map.json",
    "generation_config.json",
)

#: Number of logged losses averaged by the optional early stop of D8.
EARLY_STOP_WINDOW = 5

#: Default device-memory budget of a run (DS009): the process never lets its
#: allocator exceed this fraction of device memory, and the guard of
#: :class:`MemoryGuardCallback` stops the run before the host runs out.
DEFAULT_MEMORY_FRACTION = 0.75
DEFAULT_MEMORY_FLOOR_GB = 16.0

KIB = 1024
GIB = 1024**3

#: Exit code of a run the memory guard stopped at a checkpoint (resumable).
EXIT_STOPPED_FOR_MEMORY = 3


def log(message: str) -> None:
    print(f"[sft_train] {message}", flush=True)


def repo_path(value: str) -> Path:
    """Resolve a CLI path against the repository root."""
    path = Path(value)
    return path if path.is_absolute() else REPO_ROOT / path


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def package_version(name: str) -> str | None:
    try:
        return version(name)
    except PackageNotFoundError:
        return None


def proc_kib(path: Path, key: str) -> int:
    """Value of ``key`` (``MemAvailable:``) in a /proc-style file, in bytes."""
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith(key):
            parts = line.split()
            if len(parts) >= 2 and parts[1].isdigit():
                return int(parts[1]) * KIB
    return 0


def device_total_gib() -> float | None:
    """Total device memory in GiB as the accelerator reports it."""
    if not torch.cuda.is_available():
        return None
    return torch.cuda.get_device_properties(0).total_memory / GIB


def memory_snapshot() -> dict:
    """Host and device memory in GiB, in the shape the train log records."""
    snapshot = {
        "mem_available_gib": round(proc_kib(Path("/proc/meminfo"), "MemAvailable:") / GIB, 3),
        "rss_gib": round(proc_kib(Path("/proc/self/status"), "VmRSS:") / GIB, 3),
    }
    if torch.cuda.is_available():
        free_bytes, _ = torch.cuda.mem_get_info()
        snapshot.update(
            {
                "cuda_free_gib": round(free_bytes / GIB, 3),
                "cuda_peak_gib": round(torch.cuda.max_memory_allocated() / GIB, 3),
                "cuda_reserved_gib": round(torch.cuda.memory_reserved() / GIB, 3),
            }
        )
    else:
        snapshot.update({"cuda_free_gib": None, "cuda_peak_gib": None, "cuda_reserved_gib": None})
    return snapshot


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Supervised fine-tuning of the compiled-plan chat profile (PLAN.md T5b, D8)",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--experiment",
        required=True,
        help="experiment id (D12); names the default output directory and the run manifest",
    )
    parser.add_argument("--base-model", default=DEFAULT_BASE_MODEL, help="local base model directory")
    parser.add_argument("--data", default=DEFAULT_DATA, help="trainer-view JSONL export")
    parser.add_argument(
        "--validation-slice",
        default=DEFAULT_VALIDATION_SLICE,
        help="D11 slice whose folder ids are excluded from training",
    )
    parser.add_argument(
        "--subset",
        default=None,
        help="optional overfit subset file with a 'folders' list (task T5a)",
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help="output directory; default training/checkpoints/<experiment>",
    )
    parser.add_argument("--method", choices=("full", "lora"), default="full", help="fine-tuning method (D8)")
    parser.add_argument("--lora-r", type=int, default=16, help="LoRA rank")
    parser.add_argument("--lora-alpha", type=int, default=32, help="LoRA alpha")
    parser.add_argument("--lora-dropout", type=float, default=0.05, help="LoRA dropout")
    parser.add_argument("--epochs", type=float, default=3.0, help="number of passes over the selected rows")
    parser.add_argument("--lr", type=float, default=2e-5, help="peak learning rate")
    parser.add_argument("--batch-size", type=int, default=8, help="per-device train batch size")
    parser.add_argument("--grad-accum", type=int, default=4, help="gradient accumulation steps")
    parser.add_argument("--warmup-ratio", type=float, default=0.03, help="warmup fraction of the schedule")
    parser.add_argument("--max-seq-len", type=int, default=4096, help="sequence length of D7 (never truncated)")
    parser.add_argument("--max-steps", type=int, default=-1, help="stop after N optimizer steps; -1 disables")
    parser.add_argument("--logging-steps", type=int, default=10, help="train-log cadence in optimizer steps")
    parser.add_argument(
        "--save-steps",
        type=int,
        default=None,
        help="checkpoint every N steps; unset saves every epoch",
    )
    parser.add_argument(
        "--save-total-limit",
        type=int,
        default=0,
        help="keep at most N checkpoints; 0 keeps all (checkpoint selection needs several)",
    )
    parser.add_argument(
        "--early-stop-loss",
        type=float,
        default=0.0,
        help="stop when the mean of the last %d logged losses is below this value; 0 disables (D8 overfit gate)"
        % EARLY_STOP_WINDOW,
    )
    parser.add_argument(
        "--memory-fraction",
        type=float,
        default=DEFAULT_MEMORY_FRACTION,
        help="fraction of device memory the process may allocate; 0 disables the cap",
    )
    parser.add_argument(
        "--memory-floor-gb",
        type=float,
        default=DEFAULT_MEMORY_FLOOR_GB,
        help="stop the run at a checkpoint when available memory falls below this many GiB; 0 disables",
    )
    parser.add_argument(
        "--gradient-checkpointing",
        action="store_true",
        help="recompute activations in the backward pass to lower peak device memory",
    )
    parser.add_argument("--seed", type=int, default=3407, help="random seed recorded in the manifest")
    parser.add_argument(
        "--resume",
        nargs="?",
        const="auto",
        default=None,
        metavar="CHECKPOINT",
        help="resume from the latest checkpoint of the output directory, or from CHECKPOINT",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="tokenize, print the counts, write nothing, and exit",
    )
    parser.add_argument(
        "--token-counts-out",
        default=None,
        help="write the token counts JSON here (skipped by --dry-run)",
    )
    return parser.parse_args(argv)


def row_key(row: dict) -> str:
    """``<book>/<folder>`` identity of a training row (the folder ids of T5a/D11)."""
    meta = row.get("meta")
    if not isinstance(meta, dict) or not isinstance(meta.get("book"), str) or not isinstance(meta.get("folder"), str):
        raise ValueError("every training row must carry meta.book and meta.folder")
    return f"{meta['book']}/{meta['folder']}"


def load_rows(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as handle:
        for number, line in enumerate(handle, start=1):
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            if "messages" not in row:
                raise ValueError(f"{path}:{number}: row has no 'messages' key")
            rows.append(row)
    return rows


def read_folder_ids(path: Path) -> list[str]:
    payload = read_json(path)
    folders = payload.get("folders") if isinstance(payload, dict) else None
    if not isinstance(folders, list) or not all(isinstance(item, str) for item in folders):
        raise SystemExit(f"{path}: expected a 'folders' list of strings")
    return folders


def select_rows(
    rows: list[dict],
    validation_folders: list[str],
    subset_folders: list[str] | None,
) -> tuple[list[dict], list[dict], list[str]]:
    """Drop the validation slice, then keep only the subset when one is given.

    Returns ``(kept_rows, excluded_rows, missing_subset_folders)``. Subset entries
    are matched as ``<book>/<folder>`` or as the book-relative folder id.
    """
    validation = set(validation_folders)
    kept: list[dict] = []
    excluded: list[dict] = []
    for row in rows:
        key = row_key(row)
        if key in validation or row["meta"]["folder"] in validation:
            excluded.append(row)
        else:
            kept.append(row)
    if validation and not excluded:
        raise SystemExit(
            f"the validation slice matched no row of {len(rows)}; refusing to train on the D11 slice"
        )

    if subset_folders is None:
        return kept, excluded, []

    subset = set(subset_folders)
    selected = [row for row in kept if row_key(row) in subset or row["meta"]["folder"] in subset]
    matched = {row_key(row) for row in selected} | {row["meta"]["folder"] for row in selected}
    missing = [folder for folder in subset_folders if folder not in matched]
    if not selected:
        raise SystemExit(f"the subset selected no row out of {len(kept)} training rows")
    return selected, excluded, missing


def tokenize_rows(
    tokenizer, rows: list[dict], max_seq_len: int
) -> tuple[list[dict], list[tuple[str, int]]]:
    """Tokenize every row and collect the rows above the D7 sequence length."""
    tokenized: list[dict] = []
    offenders: list[tuple[str, int]] = []
    started = time.time()
    for index, row in enumerate(rows, start=1):
        input_ids, labels = render_and_mask(tokenizer, row["messages"])
        if len(labels) != len(input_ids):
            raise SystemExit(
                f"{row_key(row)}: loss mask length {len(labels)} differs from {len(input_ids)} input tokens"
            )
        if len(input_ids) > max_seq_len:
            offenders.append((row_key(row), len(input_ids)))
        tokenized.append({"input_ids": input_ids, "labels": labels})
        if index % 500 == 0:
            log(f"tokenized {index}/{len(rows)} rows ({time.time() - started:.1f}s)")
    return tokenized, offenders


def token_counts(tokenized: list[dict], rows: list[dict], max_seq_len: int) -> dict:
    """Real tokenized counts per row set and per book (no estimates)."""
    total_tokens = 0
    target_tokens = 0
    max_total = 0
    max_target = 0
    by_book: dict[str, dict[str, int]] = {}
    for encoded, row in zip(tokenized, rows):
        length = len(encoded["input_ids"])
        targets = sum(1 for label in encoded["labels"] if label != LOSS_IGNORE_INDEX)
        total_tokens += length
        target_tokens += targets
        max_total = max(max_total, length)
        max_target = max(max_target, targets)
        book = by_book.setdefault(row["meta"]["book"], {"rows": 0, "total_tokens": 0, "target_tokens": 0})
        book["rows"] += 1
        book["total_tokens"] += length
        book["target_tokens"] += targets
    count = len(tokenized)
    return {
        "rows": count,
        "total_tokens": total_tokens,
        "target_tokens": target_tokens,
        "masked_tokens": total_tokens - target_tokens,
        "max_total_tokens": max_total,
        "max_target_tokens": max_target,
        "mean_total_tokens": round(total_tokens / count, 3) if count else 0.0,
        "mean_target_tokens": round(target_tokens / count, 3) if count else 0.0,
        "max_seq_len": max_seq_len,
        "by_book": by_book,
    }


class TokenizedRows(torch.utils.data.Dataset):
    """In-memory tokenized rows: ``{"input_ids", "labels"}`` per item."""

    def __init__(self, rows: list[dict]):
        self.rows = rows

    def __len__(self) -> int:
        return len(self.rows)

    def __getitem__(self, index: int) -> dict:
        return self.rows[index]


class RightPaddingCollator:
    """Right-pad a batch to its longest sequence with the tokenizer pad token.

    ``attention_mask`` marks the real tokens and labels pad with
    :data:`LOSS_IGNORE_INDEX`, so padding never contributes loss (D7, DS009).
    The collator also counts the input and target tokens it actually emits,
    which is what the train log and the final manifest report as tokens seen.
    """

    def __init__(
        self,
        pad_token_id: int,
        tokens_emitted: int = 0,
        target_tokens_emitted: int = 0,
    ):
        self.pad_token_id = pad_token_id
        self.tokens_emitted = tokens_emitted
        self.target_tokens_emitted = target_tokens_emitted

    def __call__(self, features: list[dict]) -> dict:
        width = max(len(feature["input_ids"]) for feature in features)
        input_ids, attention_mask, labels = [], [], []
        for feature in features:
            ids = feature["input_ids"]
            padding = width - len(ids)
            input_ids.append(ids + [self.pad_token_id] * padding)
            attention_mask.append([1] * len(ids) + [0] * padding)
            labels.append(feature["labels"] + [LOSS_IGNORE_INDEX] * padding)
            self.tokens_emitted += len(ids)
            self.target_tokens_emitted += sum(
                1 for label in feature["labels"] if label != LOSS_IGNORE_INDEX
            )
        return {
            "input_ids": torch.tensor(input_ids, dtype=torch.long),
            "attention_mask": torch.tensor(attention_mask, dtype=torch.long),
            "labels": torch.tensor(labels, dtype=torch.long),
        }


class MemoryGuardCallback(TrainerCallback):
    """Stop a run before the shared GB10 memory pool takes the host down (DS009).

    Every step samples the pool (``MemAvailable`` of the host and the free device
    memory of the accelerator, which on the GB10 are the same pool), keeps the
    highest device allocation of the run, and stops at a step boundary with a
    checkpoint once available memory falls below the declared floor. The kernel
    OOM killer cannot see device allocations, so without this guard an
    overcommitted run freezes the desktop and dies with an empty train log.
    """

    def __init__(self, floor_gb: float, ceiling_gib: float | None = None):
        self.floor_gb = floor_gb
        self.ceiling_gib = ceiling_gib
        self.triggered = False
        self.reason: str | None = None
        self.peak_gib = 0.0
        self.last: dict = memory_snapshot()

    def sample(self) -> dict:
        snapshot = memory_snapshot()
        self.last = snapshot
        self.peak_gib = max(self.peak_gib, snapshot["cuda_peak_gib"] or 0.0)
        return snapshot

    def fields(self) -> dict:
        """Memory columns a train-log record carries."""
        return dict(self.last)

    def available_gib(self) -> float:
        free = self.last["cuda_free_gib"]
        candidates = [self.last["mem_available_gib"]]
        if free is not None:
            candidates.append(free)
        return min(candidates)

    def _check(self, control, step: int):
        snapshot = self.sample()
        if self.floor_gb > 0 and self.available_gib() < self.floor_gb:
            # The cached blocks of the run's own allocator are the first
            # suspect: hand them back before deciding to stop.
            reclaimed = 0.0
            if torch.cuda.is_available():
                before = self.available_gib()
                torch.cuda.empty_cache()
                snapshot = self.sample()
                reclaimed = self.available_gib() - before
            if self.available_gib() >= self.floor_gb:
                log(
                    f"memory guard: reclaimed {reclaimed:.1f} GiB of cached device memory at step {step}; "
                    f"available {self.available_gib():.1f} GiB"
                )
                return control
            self.triggered = True
            self.reason = (
                f"available memory {self.available_gib():.1f} GiB is below the floor of "
                f"{self.floor_gb:.1f} GiB after reclaiming {reclaimed:.1f} GiB "
                f"(CUDA free {snapshot['cuda_free_gib']:.1f} GiB, "
                f"host available {snapshot['mem_available_gib']:.1f} GiB, "
                f"process peak {self.peak_gib:.1f} GiB)"
            )
            control.should_training_stop = True
            if step > 0:
                # The checkpoint of the stopping step holds the run; at step 0
                # there is nothing to save.
                control.should_save = True
            log(f"memory guard: stopping at step {step}: {self.reason}")
            log("free memory, then " + ("continue with --resume auto" if step > 0 else "start the run again"))
        return control

    def on_log(self, args, state, control, **kwargs):
        """Hand the cached blocks back at logging cadence, then sample and reset.

        The allocator keeps freed blocks reserved (measured: 23-42 GiB at the D8
        shape against 6 GiB of live tensors), which drains the shared pool over a
        long run; releasing them at logging cadence bounds that growth, and the
        sample between the release and the reset keeps the train log honest.
        """
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        self.sample()
        if torch.cuda.is_available():
            # The peak recorded for this record is the peak of the interval that
            # just closed.
            torch.cuda.reset_peak_memory_stats()
        return control

    def on_train_begin(self, args, state, control, **kwargs):
        snapshot = self.sample()
        budget = f", ceiling {self.ceiling_gib:.1f} GiB" if self.ceiling_gib else ""
        log(
            f"memory: device free {snapshot['cuda_free_gib']:.1f} GiB, host available "
            f"{snapshot['mem_available_gib']:.1f} GiB{budget}, floor {self.floor_gb:.1f} GiB"
        )
        return self._check(control, int(state.global_step))

    def on_step_end(self, args, state, control, **kwargs):
        return self._check(control, int(state.global_step))


class TrainLogCallback(TrainerCallback):
    """Appends the train log of PLAN.md T5b and implements D8's optional early stop."""

    def __init__(
        self,
        path: Path,
        collator: RightPaddingCollator,
        early_stop_loss: float = 0.0,
        guard: MemoryGuardCallback | None = None,
    ):
        self.path = path
        self.collator = collator
        self.early_stop_loss = early_stop_loss
        self.guard = guard
        self.started = time.time()
        self.losses: list[float] = []
        self.last_loss: float | None = None
        self.early_stopped = False

    def on_log(self, args, state, control, logs=None, **kwargs):
        logs = logs or {}
        loss = logs.get("loss")
        learning_rate = logs.get("learning_rate")
        if loss is not None:
            loss = float(loss)
            self.last_loss = loss
            self.losses.append(loss)
        record = {
            "step": int(state.global_step),
            "epoch": round(float(state.epoch), 4) if state.epoch is not None else None,
            "loss": round(loss, 6) if loss is not None else None,
            "learning_rate": float(learning_rate) if learning_rate is not None else None,
            "tokens_seen": int(self.collator.tokens_emitted),
            "wall_clock_s": round(time.time() - self.started, 3),
        }
        if self.guard is not None:
            # mem_available / cuda_free / cuda_peak / cuda_reserved / rss
            record.update(self.guard.fields())
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(record, sort_keys=True) + "\n")

        if self.early_stop_loss > 0 and len(self.losses) >= EARLY_STOP_WINDOW:
            window_mean = sum(self.losses[-EARLY_STOP_WINDOW:]) / EARLY_STOP_WINDOW
            if window_mean < self.early_stop_loss:
                self.early_stopped = True
                control.should_training_stop = True
                log(
                    f"early stop at step {state.global_step}: mean loss {window_mean:.5f} over the last "
                    f"{EARLY_STOP_WINDOW} logs is below {self.early_stop_loss}"
                )
        return control


def resolve_revision(payload) -> str | None:
    """Find a model revision hash in ``training/environment/base-model.json``."""
    if not isinstance(payload, dict):
        return None
    for key in (
        "revision",
        "sha",
        "commit",
        "model_revision",
        "model_sha",
        "model_commit",
        "snapshot",
        "local_dir_revision",
    ):
        value = payload.get(key)
        if isinstance(value, str) and value:
            return value
    for value in payload.values():
        found = resolve_revision(value)
        if found:
            return found
    return None


def file_hashes(directory: Path, names: tuple[str, ...]) -> dict[str, str]:
    hashes = {}
    for name in names:
        candidate = directory / name
        if candidate.is_file():
            hashes[name] = sha256_file(candidate)
    return hashes


def build_manifest(
    args: argparse.Namespace,
    training_args: TrainingArguments,
    counts: dict,
    train_examples: int,
    rows_total: int,
    excluded_rows: int,
    missing_subset_folders: list[str],
    paths: dict,
    planned_steps: int,
    steps_per_epoch: int,
    tokens_seen_seeded: int,
) -> dict:
    """The DS009 run manifest of the experiment."""
    export_manifest = read_json(paths["export_manifest"]) if paths["export_manifest"].is_file() else {}
    profile = export_manifest.get("profile", {})
    model_manifest = read_json(paths["model_manifest"]) if paths["model_manifest"].is_file() else None
    revision = resolve_revision(model_manifest)

    target_tokens_per_epoch = counts["target_tokens"]
    if args.max_steps > 0:
        total_target_tokens = round(args.max_steps * tokens_per_step(args) * counts["mean_target_tokens"])
    else:
        total_target_tokens = round(target_tokens_per_epoch * args.epochs)

    environment_manifest = paths["environment_manifest"]
    device_total = device_total_gib()
    return {
        "experiment_id": args.experiment,
        "created_utc": utc_now(),
        "status": "running",
        "base_model_path": str(paths["base_model"]),
        "base_model_revision": revision,
        "base_model_manifest": (
            {
                "path": str(paths["model_manifest"]),
                "sha256": sha256_file(paths["model_manifest"]),
                "content": model_manifest,
            }
            if paths["model_manifest"].is_file()
            else None
        ),
        "tokenizer_path": str(paths["base_model"]),
        "tokenizer_revision": revision,
        "tokenizer_file_hashes": file_hashes(paths["base_model"], TOKENIZER_FILES),
        "dataset_path": str(paths["data"]),
        "dataset_sha256": sha256_file(paths["data"]),
        "dataset_snapshot": export_manifest.get("snapshot"),
        "dataset_file_hashes": {
            name: entry.get("sha256")
            for name, entry in sorted(export_manifest.get("files", {}).items())
            if isinstance(entry, dict)
        },
        "dataset_export_manifest": str(paths["export_manifest"]),
        "dataset_export_manifest_sha256": (
            sha256_file(paths["export_manifest"]) if paths["export_manifest"].is_file() else None
        ),
        "dataset_rows_total": rows_total,
        "train_examples": train_examples,
        "validation_slice": {
            "path": str(paths["validation_slice"]),
            "sha256": sha256_file(paths["validation_slice"]),
            "folder_ids": len(read_folder_ids(paths["validation_slice"])),
            "excluded_rows": excluded_rows,
        },
        "subset": (
            {
                "path": str(paths["subset"]),
                "sha256": sha256_file(paths["subset"]),
                "folder_ids": len(read_folder_ids(paths["subset"])),
                "selected_rows": train_examples,
                "folder_ids_without_row": len(missing_subset_folders),
            }
            if paths["subset"] is not None
            else None
        ),
        "chat_profile_id": profile.get("id"),
        "system_prompt_sha256": profile.get("systemPromptSha256"),
        "max_seq_len": args.max_seq_len,
        "packing_policy": "none",
        "per_device_train_batch_size": args.batch_size,
        "gradient_accumulation_steps": args.grad_accum,
        "effective_batch_size": args.batch_size * args.grad_accum,
        "optimizer": "adamw_torch",
        "learning_rate": args.lr,
        "lr_schedule": "cosine",
        "warmup_ratio": args.warmup_ratio,
        "warmup_steps": training_args.get_warmup_steps(planned_steps),
        "precision": "bf16",
        "gradient_clip_norm": 1.0,
        "attn_implementation": "sdpa",
        "gradient_checkpointing": bool(getattr(args, "gradient_checkpointing", False)),
        "memory_budget": {
            "process_fraction": args.memory_fraction,
            "process_ceiling_gib": (
                round(args.memory_fraction * device_total, 3)
                if args.memory_fraction > 0 and device_total is not None
                else None
            ),
            "device_total_gib": round(device_total, 3) if device_total is not None else None,
            "floor_gb": args.memory_floor_gb,
            "stop_exit_code": EXIT_STOPPED_FOR_MEMORY,
        },
        "method": args.method,
        "lora": (
            {
                "r": args.lora_r,
                "alpha": args.lora_alpha,
                "dropout": args.lora_dropout,
                "target_modules": list(LORA_TARGET_MODULES),
                "bias": "none",
                "task_type": "CAUSAL_LM",
            }
            if args.method == "lora"
            else None
        ),
        "seed": args.seed,
        "epochs": args.epochs,
        "max_steps": args.max_steps,
        "steps_per_epoch": steps_per_epoch,
        "planned_steps": planned_steps,
        "tokens_seen_seeded": tokens_seen_seeded,
        "target_tokens_per_epoch": target_tokens_per_epoch,
        "total_target_tokens": total_target_tokens,
        "total_tokens_per_epoch": counts["total_tokens"],
        "token_counts": counts,
        "checkpoint_cadence": {
            "save_strategy": training_args.save_strategy,
            "save_steps": args.save_steps,
            "save_total_limit": args.save_total_limit or None,
            "early_stop_loss": args.early_stop_loss or None,
        },
        "evaluation_cadence": "none",
        "environment_manifest_path": str(paths["environment_manifest"]),
        "environment_manifest_sha256": (
            sha256_file(environment_manifest) if environment_manifest.is_file() else None
        ),
        "trainer_stack": {
            "torch": torch.__version__,
            "torch_cuda": torch.version.cuda,
            "transformers": package_version("transformers"),
            "accelerate": package_version("accelerate"),
            "peft": package_version("peft") if args.method == "lora" else None,
        },
        "output_dir": str(paths["output_dir"]),
        "train_log": str(paths["train_log"]),
        "token_counts_out": str(paths["token_counts_out"]) if paths["token_counts_out"] else None,
    }


def tokens_per_step(args: argparse.Namespace) -> int:
    return args.batch_size * args.grad_accum


def read_log_tokens_seen(path: Path) -> int:
    """Last input-token count of an existing train log, for ``--resume`` accounting.

    The token counters live in the training process, so a resumed run continues
    the previous run's accounting from its last complete log line (a line cut
    short by a kill is skipped).
    """
    if not path.is_file():
        return 0
    last = 0
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(record.get("tokens_seen"), int):
            last = record["tokens_seen"]
    return last


def load_tokenizer(base_model: Path):
    tokenizer = AutoTokenizer.from_pretrained(str(base_model))
    if tokenizer.pad_token_id is None:
        raise SystemExit(
            f"{base_model}: the tokenizer has no pad token; right padding with -100 labels needs one"
        )
    # D7: right padding, and labels pad with LOSS_IGNORE_INDEX in the collator.
    tokenizer.padding_side = "right"
    return tokenizer


def load_model(args: argparse.Namespace, base_model: Path):
    model = AutoModelForCausalLM.from_pretrained(
        str(base_model),
        dtype=torch.bfloat16,
        attn_implementation="sdpa",
    )
    if getattr(args, "gradient_checkpointing", False):
        # Recompute each block in the backward pass: the activations of a long
        # batch stop dominating the shared GB10 pool.
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={"use_reentrant": False})
    if args.method == "lora":
        from peft import LoraConfig, get_peft_model

        model = get_peft_model(
            model,
            LoraConfig(
                r=args.lora_r,
                lora_alpha=args.lora_alpha,
                lora_dropout=args.lora_dropout,
                target_modules=list(LORA_TARGET_MODULES),
                bias="none",
                task_type="CAUSAL_LM",
            ),
        )
        model.print_trainable_parameters()
    return model


def resolve_resume(args: argparse.Namespace, output_dir: Path) -> str | None:
    """Turn ``--resume`` into an explicit checkpoint path (or fail clearly)."""
    if not args.resume:
        return None
    if args.resume != "auto":
        checkpoint = repo_path(args.resume)
        if not checkpoint.is_dir():
            raise SystemExit(f"--resume {args.resume}: no such checkpoint directory")
        return str(checkpoint)
    from transformers.trainer_utils import get_last_checkpoint

    checkpoint = get_last_checkpoint(str(output_dir)) if output_dir.is_dir() else None
    if checkpoint is None:
        raise SystemExit(f"--resume: no checkpoint found under {output_dir}; start the run without --resume")
    return checkpoint


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    started = time.time()

    base_model = repo_path(args.base_model)
    data_path = repo_path(args.data)
    validation_slice_path = repo_path(args.validation_slice)
    subset_path = repo_path(args.subset) if args.subset else None
    output_dir = repo_path(args.output_dir) if args.output_dir else REPO_ROOT / "training" / "checkpoints" / args.experiment
    token_counts_out = repo_path(args.token_counts_out) if args.token_counts_out else None
    train_log_path = output_dir / "train-log.jsonl"
    run_manifest_path = output_dir / "run-manifest.json"
    paths = {
        "base_model": base_model,
        "data": data_path,
        "validation_slice": validation_slice_path,
        "subset": subset_path,
        "output_dir": output_dir,
        "train_log": train_log_path,
        "run_manifest": run_manifest_path,
        "token_counts_out": token_counts_out,
        "model_manifest": repo_path(DEFAULT_MODEL_MANIFEST),
        "export_manifest": repo_path(DEFAULT_EXPORT_MANIFEST),
        "environment_manifest": repo_path(DEFAULT_ENVIRONMENT_MANIFEST),
    }
    if not data_path.is_file():
        raise SystemExit(f"{data_path}: the trainer view does not exist")
    if not validation_slice_path.is_file():
        raise SystemExit(f"{validation_slice_path}: the D11 validation slice does not exist")
    if not base_model.is_dir():
        raise SystemExit(f"{base_model}: the base model directory does not exist")

    rows = load_rows(data_path)
    kept_rows, excluded_rows, missing_subset_folders = select_rows(
        rows,
        read_folder_ids(validation_slice_path),
        read_folder_ids(subset_path) if subset_path is not None else None,
    )
    if missing_subset_folders:
        log(f"warning: {len(missing_subset_folders)} subset folder ids matched no training row")
    log(
        f"data: {len(rows)} rows, {len(excluded_rows)} excluded by the validation slice, "
        f"{len(kept_rows)} selected for training"
    )

    tokenizer = load_tokenizer(base_model)
    tokenized, offenders = tokenize_rows(tokenizer, kept_rows, args.max_seq_len)
    if offenders:
        log(f"aborting: {len(offenders)} rows exceed --max-seq-len {args.max_seq_len} (D7 forbids truncation):")
        for key, length in offenders:
            log(f"  {key}: {length} tokens")
        return 2

    counts = token_counts(tokenized, kept_rows, args.max_seq_len)
    log(
        f"tokens: {counts['rows']} rows, {counts['total_tokens']} total, "
        f"{counts['target_tokens']} target, max total {counts['max_total_tokens']}, "
        f"max target {counts['max_target_tokens']}"
    )

    if args.dry_run:
        print(json.dumps(counts, indent=2, sort_keys=True))
        log(
            f"dry run: {counts['rows']} rows, {counts['target_tokens']} target tokens per epoch, "
            f"nothing written (output dir would be {output_dir})"
        )
        return 0

    memory_ceiling_gib: float | None = None
    if args.memory_fraction > 0:
        total_gib = device_total_gib()
        if total_gib is None:
            raise SystemExit("--memory-fraction needs a CUDA device; pass --memory-fraction 0 to disable the cap")
        torch.cuda.set_per_process_memory_fraction(args.memory_fraction)
        memory_ceiling_gib = args.memory_fraction * total_gib
        if args.memory_floor_gb > 0 and memory_ceiling_gib + args.memory_floor_gb > total_gib:
            raise SystemExit(
                f"--memory-fraction {args.memory_fraction} plus --memory-floor-gb {args.memory_floor_gb} "
                f"exceeds the {total_gib:.1f} GiB device: the allocator cap alone would leave the machine "
                "below the floor; lower the fraction or the floor"
            )
        log(
            f"device memory cap: {memory_ceiling_gib:.1f} GiB of {total_gib:.1f} GiB "
            f"(fraction {args.memory_fraction})"
        )

    if token_counts_out is not None:
        write_json(token_counts_out, counts)
        log(f"token counts written to {token_counts_out}")

    output_dir.mkdir(parents=True, exist_ok=True)
    resume_from = resolve_resume(args, output_dir)
    if resume_from is None:
        train_log_path.write_text("", encoding="utf-8")
    # A resumed run continues the token accounting of the previous run instead of
    # restarting it: the counters of a collator live in the training process.
    seeded_tokens = read_log_tokens_seen(train_log_path) if resume_from else 0
    if seeded_tokens:
        log(f"resuming token accounting at {seeded_tokens} input tokens")

    # The Trainer counts update steps the way its own loop does: one update per
    # full accumulation window over the epoch's batches, plus one more for the
    # remainder (`transformers` `set_initial_training_values`). The manifest must
    # record that number; a floor division of it undercounts every epoch whose
    # batch count is not a multiple of the accumulation, and the earlier runs
    # recorded 8 steps per epoch where the Trainer ran 9.
    batches_per_epoch = math.ceil(len(tokenized) / args.batch_size)
    steps_per_epoch = max(
        batches_per_epoch // args.grad_accum + int(batches_per_epoch % args.grad_accum > 0),
        1,
    )
    planned_steps = args.max_steps if args.max_steps > 0 else max(int(math.ceil(steps_per_epoch * args.epochs)), 1)
    if args.max_steps > 0:
        log(f"--max-steps {args.max_steps} overrides the {args.epochs} epoch schedule")

    training_args = TrainingArguments(
        output_dir=str(output_dir),
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        learning_rate=args.lr,
        num_train_epochs=args.epochs,
        max_steps=args.max_steps,
        lr_scheduler_type="cosine",
        # transformers >= 5 takes the warmup as a ratio in [0, 1) through warmup_steps.
        warmup_steps=args.warmup_ratio,
        max_grad_norm=1.0,
        optim="adamw_torch",
        bf16=True,
        seed=args.seed,
        data_seed=args.seed,
        report_to=[],
        remove_unused_columns=False,
        do_eval=False,
        eval_strategy="no",
        logging_strategy="steps",
        logging_steps=args.logging_steps,
        save_strategy="steps" if args.save_steps else "epoch",
        save_steps=args.save_steps or 500,
        save_total_limit=args.save_total_limit or None,
        # Token counting in the collator is exact only when the batches are collated
        # in the training process, so the dataloader never forks workers.
        dataloader_num_workers=0,
    )

    manifest = build_manifest(
        args,
        training_args,
        counts,
        train_examples=len(tokenized),
        rows_total=len(rows),
        excluded_rows=len(excluded_rows),
        missing_subset_folders=missing_subset_folders,
        paths=paths,
        planned_steps=planned_steps,
        steps_per_epoch=steps_per_epoch,
        tokens_seen_seeded=seeded_tokens,
    )

    model = load_model(args, base_model)
    # On resume the target counter is seeded with the dataset's target share of the
    # tokens recorded in the train log; the input counter is exact.
    collator = RightPaddingCollator(
        pad_token_id=tokenizer.pad_token_id,
        tokens_emitted=seeded_tokens,
        target_tokens_emitted=(
            round(seeded_tokens * counts["target_tokens"] / counts["total_tokens"]) if seeded_tokens else 0
        ),
    )
    guard = MemoryGuardCallback(floor_gb=args.memory_floor_gb, ceiling_gib=memory_ceiling_gib)
    log_callback = TrainLogCallback(
        train_log_path,
        collator,
        early_stop_loss=args.early_stop_loss,
        guard=guard,
    )
    callbacks = [guard, log_callback]

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=TokenizedRows(tokenized),
        data_collator=collator,
        processing_class=tokenizer,
        callbacks=callbacks,
    )

    write_json(run_manifest_path, manifest)
    log(
        f"training {args.experiment}: {len(tokenized)} examples, {planned_steps} steps "
        f"(effective batch {tokens_per_step(args)}), method {args.method}, lr {args.lr}"
    )
    if resume_from:
        log(f"resuming from {resume_from}")

    result = trainer.train(resume_from_checkpoint=resume_from)
    wall_clock = round(time.time() - started, 3)

    if guard.triggered:
        # The checkpoint of the stopping step holds the run; the final model is
        # not written because the run is incomplete by contract. The manifest of
        # the next episode overwrites this one, so the stop is also appended to
        # an episode log that no resume rewrites.
        stop_record = {
            "stopped_utc": utc_now(),
            "step": int(result.global_step),
            "reason": guard.reason,
            "available_gib": round(guard.available_gib(), 3),
            "peak_device_memory_gib": guard.peak_gib,
            "wall_clock_s": round(time.time() - started, 3),
        }
        with (output_dir / "memory-stops.jsonl").open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(stop_record, sort_keys=True) + "\n")
        manifest.update(
            {
                "status": "stopped_for_memory",
                "finished_utc": utc_now(),
                "memory_stop_reason": guard.reason,
                "steps_completed": int(result.global_step),
                "final_loss": round(float(log_callback.last_loss), 6) if log_callback.last_loss is not None else None,
                "tokens_seen": int(collator.tokens_emitted),
                "target_tokens_seen": int(collator.target_tokens_emitted),
                "peak_device_memory_gib": guard.peak_gib,
                "wall_clock_s": wall_clock,
            }
        )
        write_json(run_manifest_path, manifest)
        log(f"stopped by the memory guard at step {result.global_step}: {guard.reason}")
        if result.global_step > 0:
            log(f"checkpoints: {output_dir}/checkpoint-{result.global_step}; continue with --resume auto")
        else:
            log("no step ran; free memory and start the run again")
        return EXIT_STOPPED_FOR_MEMORY

    trainer.save_model(str(output_dir))
    tokenizer.save_pretrained(str(output_dir))

    callback = log_callback
    manifest.update(
        {
            "status": "completed",
            "finished_utc": utc_now(),
            "steps_completed": int(result.global_step),
            "final_loss": round(float(callback.last_loss), 6) if callback.last_loss is not None else None,
            "tokens_seen": int(collator.tokens_emitted),
            "target_tokens_seen": int(collator.target_tokens_emitted),
            "early_stopped": callback.early_stopped,
            "peak_device_memory_gib": guard.peak_gib,
            "memory_stop_reason": None,
            "wall_clock_s": wall_clock,
        }
    )
    write_json(run_manifest_path, manifest)

    final_loss = manifest["final_loss"]
    print()
    print("=== run summary ===")
    print(f"experiment:            {args.experiment}")
    print(f"steps:                 {result.global_step}")
    print(f"final loss:            {final_loss if final_loss is not None else 'n/a'}")
    print(f"tokens seen:           {collator.tokens_emitted} ({collator.target_tokens_emitted} target)")
    print(f"peak device memory:    {guard.peak_gib} GiB")
    print(f"wall clock:            {wall_clock}s")
    print(f"output dir:            {output_dir}")
    print(f"run manifest:          {run_manifest_path}")
    print(f"train log:             {train_log_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
