#!/usr/bin/env python3
"""Sequence-length gate for the trainer view (training/PLAN.md task T2, decision D7).

Measures every row of the trainer export twice:

* the full templated conversation (system + user + assistant) with the base
  model's own chat template, applying no custom template, exactly as training
  will feed it;
* the assistant target span, through ``render_and_mask`` of
  ``training/python/chat_mask.py``, which is the single definition of the loss
  mask (count of labels != -100).

The result is written to ``--out`` as a machine-readable artifact and the
process exits nonzero as soon as one row exceeds ``--max-seq-len``. Rows above
the limit are redesigned into local data (D7); they are never truncated,
because a truncated SOP Lang target teaches syntactically incomplete programs
(DS009).

Typical run, from the repository root, inside ``training/.venv``:

    python training/python/token_stats.py \\
        --model training/models/qwen2.5-coder-0.5b-instruct \\
        --rows training/data/all-books.jsonl \\
        --out training/data/token-stats.json \\
        --max-seq-len 4096

Add ``--sample 300`` for a fast run: every k-th row is measured, k chosen so
that about 300 rows spread over the whole file (and therefore over all books)
are measured.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

try:
    from chat_mask import render_and_mask
except ImportError as exc:  # pragma: no cover - environment error path
    raise SystemExit(
        "token_stats.py: cannot import render_and_mask from training/python/chat_mask.py "
        f"({exc}).\nThe loss mask is defined once in that module (training/PLAN.md T5b/T5c); "
        "it must exist before the token gate can measure assistant-target lengths."
    )

DEFAULT_MODEL = "training/models/qwen2.5-coder-0.5b-instruct"
DEFAULT_ROWS = "training/data/all-books.jsonl"
DEFAULT_OUT = "training/data/token-stats.json"
DEFAULT_MAX_SEQ_LEN = 4096

BATCH_SIZE = 64
PROGRESS_EVERY = 500
OVER_LIMIT_LIST_CAP = 50
WORST_OFFENDERS_SHOWN = 10
EXPORT_MANIFEST_NAME = "export-manifest.json"


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sequence-length gate for the trainer export (PLAN.md T2, D7).",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--model", default=DEFAULT_MODEL, help="base model path or hub id (tokenizer source)")
    parser.add_argument("--rows", default=DEFAULT_ROWS, help="trainer-view JSONL export")
    parser.add_argument("--out", default=DEFAULT_OUT, help="JSON artifact to write")
    parser.add_argument("--max-seq-len", type=int, default=DEFAULT_MAX_SEQ_LEN, help="hard sequence-length gate")
    parser.add_argument(
        "--sample",
        type=int,
        default=None,
        help="measure about N rows (every k-th row) instead of the whole file",
    )
    return parser.parse_args(argv)


def load_rows(path: str, sample: int | None) -> tuple[list[dict], int, dict | None]:
    with open(path, encoding="utf-8") as handle:
        rows = [json.loads(line) for line in handle if line.strip()]
    total = len(rows)
    if sample is None or sample <= 0 or sample >= total:
        return rows, total, None
    stride = max(1, math.ceil(total / sample))
    sampled = rows[::stride][:sample]
    return sampled, total, {"requested": sample, "stride": stride, "rows_measured": len(sampled)}


def tokenizer_revision(tokenizer) -> str | None:
    """The pinned tokenizer revision, when the loader or the local snapshot records one."""
    revision = getattr(tokenizer, "_commit_hash", None)
    if revision:
        return str(revision)
    init_kwargs = getattr(tokenizer, "init_kwargs", None) or {}
    for key in ("_commit_hash", "revision"):
        if init_kwargs.get(key):
            return str(init_kwargs[key])
    return local_hub_revision(getattr(tokenizer, "name_or_path", None))


def local_hub_revision(model_path: str | None) -> str | None:
    """Commit hash recorded beside a locally downloaded snapshot, when present.

    ``AutoTokenizer.from_pretrained`` only records ``_commit_hash`` for a hub
    lookup, so a snapshot loaded from ``training/models/`` is traced through the
    metadata ``hf download`` writes into ``.cache/huggingface/download/``.
    """
    if not model_path:
        return None
    download_dir = Path(model_path) / ".cache" / "huggingface" / "download"
    for name in ("tokenizer_config.json.metadata", "tokenizer.json.metadata", "config.json.metadata"):
        try:
            first_line = (download_dir / name).read_text(encoding="utf-8").splitlines()[0].strip()
        except (OSError, IndexError):
            continue
        if first_line:
            return first_line
    return None


def template_token_ids(tokenizer, messages: list[dict], add_generation_prompt: bool = False) -> list[int]:
    """Token ids of one conversation rendered with the model's own chat template.

    ``transformers`` 5 returns a ``BatchEncoding`` (dict-like) by default and 4
    returns a plain list, so the result is normalized here instead of being
    guessed at every call site.
    """
    kwargs = {"tokenize": True, "add_generation_prompt": add_generation_prompt}
    try:
        encoded = tokenizer.apply_chat_template(messages, return_dict=False, **kwargs)
    except TypeError:  # older signature without return_dict
        encoded = tokenizer.apply_chat_template(messages, **kwargs)
    if isinstance(encoded, dict):
        encoded = encoded["input_ids"]
    elif hasattr(encoded, "input_ids"):
        encoded = encoded.input_ids
    if hasattr(encoded, "tolist"):
        encoded = encoded.tolist()
    if encoded and isinstance(encoded[0], (list, tuple)):  # batched layout for one conversation
        encoded = encoded[0]
    return list(encoded)


def encode_conversations(tokenizer, conversations: list[list[dict]]) -> list[list[int]]:
    """Tokenize a batch of conversations with the model's own chat template."""
    try:
        encoded = tokenizer.apply_chat_template(
            conversations, tokenize=True, add_generation_prompt=False, return_dict=False
        )
    except TypeError:  # older signature without return_dict
        encoded = tokenizer.apply_chat_template(conversations, tokenize=True, add_generation_prompt=False)
    except Exception:  # batched templating is unsupported in some versions
        encoded = None
    if isinstance(encoded, dict):
        encoded = encoded["input_ids"]
    elif hasattr(encoded, "input_ids"):
        encoded = encoded.input_ids
    if hasattr(encoded, "tolist"):
        encoded = encoded.tolist()
    if (
        isinstance(encoded, list)
        and len(encoded) == len(conversations)
        and all(isinstance(ids, (list, tuple)) for ids in encoded)
    ):
        return [list(ids) for ids in encoded]
    return [template_token_ids(tokenizer, conversation) for conversation in conversations]


def measure(tokenizer, rows: list[dict]) -> list[dict]:
    measurements: list[dict] = []
    total = len(rows)
    next_progress = PROGRESS_EVERY
    for start in range(0, total, BATCH_SIZE):
        batch = rows[start : start + BATCH_SIZE]
        encoded = encode_conversations(tokenizer, [row["messages"] for row in batch])
        for offset, (row, ids) in enumerate(zip(batch, encoded)):
            meta = row.get("meta") or {}
            book = str(meta.get("book") or "unknown")
            folder = str(meta.get("folder") or "")
            try:
                input_ids, labels = render_and_mask(tokenizer, row["messages"])
            except Exception as exc:
                raise SystemExit(
                    f"token_stats.py: chat_mask.render_and_mask failed on row {start + offset} "
                    f"({book}/{folder}): {type(exc).__name__}: {exc}"
                ) from exc
            measurements.append(
                {
                    "index": start + offset,
                    "book": book,
                    "folder": f"{book}/{folder}" if folder else book,
                    "total_tokens": len(ids),
                    "target_tokens": sum(1 for label in labels if label != -100),
                    "token_count_mismatch": len(input_ids) != len(ids),
                }
            )
        processed = start + len(batch)
        while next_progress <= processed:
            print(f"  measured {min(processed, total)}/{total} rows", flush=True)
            next_progress += PROGRESS_EVERY
    return measurements


def percentile(sorted_values: list[int], pct: float) -> float:
    """Linear-interpolated percentile over already sorted values."""
    count = len(sorted_values)
    if count == 1:
        return float(sorted_values[0])
    rank = (pct / 100.0) * (count - 1)
    lower = math.floor(rank)
    upper = math.ceil(rank)
    if lower == upper:
        return float(sorted_values[lower])
    return sorted_values[lower] + (rank - lower) * (sorted_values[upper] - sorted_values[lower])


def summarise(values: list[int]) -> dict[str, int]:
    ordered = sorted(values)
    return {
        "min": ordered[0],
        "p50": round(percentile(ordered, 50)),
        "p90": round(percentile(ordered, 90)),
        "p99": round(percentile(ordered, 99)),
        "max": ordered[-1],
    }


def sha256_of(path: Path) -> str:
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def build_artifact(
    args: argparse.Namespace,
    tokenizer,
    rows_in_file: int,
    sampling: dict | None,
    measurements: list[dict],
    manifest_sha256: str,
) -> dict[str, int | str | None | dict]:
    per_book: dict[str, dict[str, list[int]]] = {}
    for measurement in measurements:
        bucket = per_book.setdefault(measurement["book"], {"total_tokens": [], "target_tokens": []})
        bucket["total_tokens"].append(measurement["total_tokens"])
        bucket["target_tokens"].append(measurement["target_tokens"])

    over_limit = sorted(
        (m for m in measurements if m["total_tokens"] > args.max_seq_len),
        key=lambda m: (-m["total_tokens"], m["folder"]),
    )

    return {
        "tokenizer": {
            "path": args.model,
            "name_or_path": getattr(tokenizer, "name_or_path", args.model),
            "class": type(tokenizer).__name__,
            "revision": tokenizer_revision(tokenizer),
        },
        "rows": len(measurements),
        "rows_in_file": rows_in_file,
        "sampling": sampling,
        "max_seq_len": args.max_seq_len,
        "export_manifest_sha256": manifest_sha256,
        "total_tokens": {
            "combined": summarise([m["total_tokens"] for m in measurements]),
            "per_book": {book: summarise(bucket["total_tokens"]) for book, bucket in sorted(per_book.items())},
        },
        "target_tokens": {
            "combined": summarise([m["target_tokens"] for m in measurements]),
            "per_book": {book: summarise(bucket["target_tokens"]) for book, bucket in sorted(per_book.items())},
        },
        "rows_with_token_count_mismatch": sum(1 for m in measurements if m["token_count_mismatch"]),
        "over_limit": {
            "count": len(over_limit),
            "listed": min(len(over_limit), OVER_LIMIT_LIST_CAP),
            "entries": [
                {"folder": m["folder"], "total_tokens": m["total_tokens"]}
                for m in over_limit[:OVER_LIMIT_LIST_CAP]
            ],
        },
    }


def describe(label: str, stats: dict[str, int]) -> str:
    return (
        f"{label:<8} min {stats['min']:>6}  p50 {stats['p50']:>6}  p90 {stats['p90']:>6}  "
        f"p99 {stats['p99']:>6}  max {stats['max']:>6}"
    )


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    try:
        from transformers import AutoTokenizer
    except ImportError as exc:  # pragma: no cover - environment error path
        raise SystemExit(
            f"token_stats.py: transformers is not importable ({exc}).\n"
            "Run training/environment/setup.sh and use training/.venv (training/PLAN.md T1)."
        )

    manifest_path = Path(args.rows).resolve().parent / EXPORT_MANIFEST_NAME
    if not manifest_path.is_file():
        print(
            f"token-stats: missing {manifest_path} — the artifact records the snapshot it measured, "
            "so the export manifest must exist first (PLAN.md task T2 step 3).",
            file=sys.stderr,
        )
        return 2

    tokenizer = AutoTokenizer.from_pretrained(args.model)
    revision = tokenizer_revision(tokenizer) or "unknown"
    print(f"tokenizer: {getattr(tokenizer, 'name_or_path', args.model)} (revision {revision})", flush=True)

    rows, rows_in_file, sampling = load_rows(args.rows, args.sample)
    if not rows:
        print(f"token-stats: no rows in {args.rows}", file=sys.stderr)
        return 2
    if sampling:
        print(
            f"sampling: every {sampling['stride']}-th row, {sampling['rows_measured']} rows measured "
            f"(requested {sampling['requested']})",
            flush=True,
        )

    measurements = measure(tokenizer, rows)
    manifest_sha256 = sha256_of(manifest_path)
    artifact = build_artifact(args, tokenizer, rows_in_file, sampling, measurements, manifest_sha256)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as handle:
        json.dump(artifact, handle, indent=2, ensure_ascii=False)
        handle.write("\n")

    print(f"rows measured: {artifact['rows']} of {artifact['rows_in_file']}")
    print(f"max_seq_len  : {args.max_seq_len}")
    print(describe("total", artifact["total_tokens"]["combined"]))
    print(describe("target", artifact["target_tokens"]["combined"]))
    for book, stats in artifact["total_tokens"]["per_book"].items():
        target = artifact["target_tokens"]["per_book"][book]
        print(f"  {book}")
        print(f"    {describe('total', stats)}")
        print(f"    {describe('target', target)}")
    print(f"wrote {out_path} (export manifest sha256 {manifest_sha256})")
    mismatches = artifact["rows_with_token_count_mismatch"]
    if mismatches:
        print(
            f"FAIL: {mismatches} rows where the chat-template length differs from the mask input_ids "
            "length; the assistant-target measurement is not trustworthy. Check chat_mask.py and the "
            "installed transformers version before using this artifact.",
            file=sys.stderr,
        )
        return 1

    over = artifact["over_limit"]
    if over["count"]:
        print("", file=sys.stderr)
        print(
            f"FAIL: {over['count']} of {artifact['rows']} rows exceed max_seq_len {args.max_seq_len}.",
            file=sys.stderr,
        )
        print("Worst offenders (folder, total tokens):", file=sys.stderr)
        for entry in over["entries"][:WORST_OFFENDERS_SHOWN]:
            print(f"  {entry['total_tokens']:>6}  {entry['folder']}", file=sys.stderr)
        print(
            "D7: such rows are redesigned into local data, never truncated; if the count stays "
            "nonzero after redesign, raise the global length to 5120 and record it in the manifests.",
            file=sys.stderr,
        )
        return 1

    print(f"OK: no row exceeds max_seq_len {args.max_seq_len}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
