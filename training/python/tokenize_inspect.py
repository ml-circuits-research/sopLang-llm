#!/usr/bin/env python3
"""Loss-mask inspection artifact (training/PLAN.md task T5c).

Renders one trainer row with the base model's own chat template, prints the
loss mask that ``training/python/chat_mask.py`` produces for it — one line per
token — and verifies, independently of that module, that the loss-bearing span
starts exactly at the assistant content and ends with the closing end-of-turn
token. DS009 requires this artifact so a human can confirm that padding,
system text, and user text are masked out and only the assistant target is
trained.

Typical run, from the repository root, inside ``training/.venv``:

    python training/python/tokenize_inspect.py \\
        --model training/models/qwen2.5-coder-0.5b-instruct \\
        --rows training/data/all-books.jsonl \\
        --folder "adult-reasoning/no-knowledge/instructions-and-warnings/1-the-warehouse-notice-variant-1" \\
        --out training/checkpoints/exp-001-overfit/mask-inspect.txt

Exit status is 0 only when the mask is non-empty, contiguous, covered by
assistant text, and closed by the end-of-turn token.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from token_stats import template_token_ids, tokenizer_revision

try:
    from chat_mask import render_and_mask
except ImportError as exc:  # pragma: no cover - environment error path
    raise SystemExit(
        "tokenize_inspect.py: cannot import render_and_mask from training/python/chat_mask.py "
        f"({exc}).\nThe loss mask is defined once in that module (training/PLAN.md T5b/T5c)."
    )

DEFAULT_MODEL = "training/models/qwen2.5-coder-0.5b-instruct"
DEFAULT_ROWS = "training/data/all-books.jsonl"
DEFAULT_OUT = "training/checkpoints/exp-001-overfit/mask-inspect.txt"

# Generic end-of-turn markers, used only when the template itself does not spell
# the marker out after the assistant content.
TURN_END_FALLBACK_MARKERS = ("<|im_end|>", "<|endoftext|>", "</s>", "<|eot_id|>", "<|end_of_text|>", "<|end|>")
CHECK_WIDTH = 46


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Write the T5c loss-mask inspection artifact for one trainer row.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--model", default=DEFAULT_MODEL, help="base model path or hub id (tokenizer source)")
    parser.add_argument("--rows", default=DEFAULT_ROWS, help="trainer-view JSONL export")
    parser.add_argument("--out", default=DEFAULT_OUT, help="artifact path (human-readable text)")
    selector = parser.add_mutually_exclusive_group()
    selector.add_argument("--folder", default=None, help="row to inspect as <book>/<folder>")
    selector.add_argument("--index", type=int, default=None, help="0-based row index to inspect")
    return parser.parse_args(argv)


def load_rows(path: str) -> list[dict]:
    with open(path, encoding="utf-8") as handle:
        return [json.loads(line) for line in handle if line.strip()]


def row_id(row: dict) -> str:
    meta = row.get("meta") or {}
    book = str(meta.get("book") or "unknown")
    folder = str(meta.get("folder") or "")
    return f"{book}/{folder}" if folder else book


def select_row(rows: list[dict], folder: str | None, index: int | None) -> tuple[int, dict]:
    if folder is not None:
        wanted = folder.strip().lstrip("./")
        matches = [
            (position, row)
            for position, row in enumerate(rows)
            if wanted in (row_id(row), str((row.get("meta") or {}).get("folder") or ""))
        ]
        if not matches:
            raise SystemExit(f"tokenize_inspect.py: no row matches --folder {folder!r} in {len(rows)} rows")
        if len(matches) > 1:
            raise SystemExit(
                f"tokenize_inspect.py: --folder {folder!r} matches {len(matches)} rows; "
                "use the full <book>/<folder> id"
            )
        return matches[0]
    position = 0 if index is None else index
    if position < 0 or position >= len(rows):
        raise SystemExit(f"tokenize_inspect.py: --index {position} outside 0..{len(rows) - 1}")
    return position, rows[position]


def loss_span(labels: list[int]) -> dict | None:
    positions = [position for position, label in enumerate(labels) if label != -100]
    if not positions:
        return None
    return {
        "start": positions[0],
        "end": positions[-1] + 1,
        "count": len(positions),
        "contiguous": positions == list(range(positions[0], positions[-1] + 1)),
    }


def template_assistant_span(tokenizer, messages: list[dict]) -> dict | None:
    """Expected assistant span from the template's own {% generation %} markers."""
    if "{% generation %}" not in (getattr(tokenizer, "chat_template", None) or ""):
        # Without the tags transformers still answers, with a mask that just repeats
        # the loss boundary we want to check independently: not usable as evidence.
        return None
    try:
        out = tokenizer.apply_chat_template(
            messages, tokenize=True, add_generation_prompt=False, return_assistant_tokens_mask=True
        )
    except Exception:  # older templates/versions do not support the flag
        return None
    ids = mask = None
    if isinstance(out, tuple) and len(out) == 2:
        ids, mask = out
    elif hasattr(out, "keys") and "assistant_masks" in out:
        ids, mask = out["input_ids"], out["assistant_masks"]
    if ids is None or mask is None:
        return None
    if ids and isinstance(ids[0], list):
        ids, mask = ids[0], mask[0]
    ids, mask = list(ids), [int(value) for value in mask]
    if len(ids) != len(mask) or sum(mask) == 0:
        return None
    positions = [position for position, value in enumerate(mask) if value]
    return {
        "start": positions[0],
        "end": positions[-1] + 1,
        "ids": ids,
        "method": "the template's own {% generation %} mask",
    }


def prefix_method_start(tokenizer, messages: list[dict], input_ids: list[int]) -> dict | None:
    """Expected assistant start from tokenizing the prompt-with-generation-prompt separately."""
    prompt_ids = template_token_ids(tokenizer, list(messages[:-1]), add_generation_prompt=True)
    if not prompt_ids or input_ids[: len(prompt_ids)] != prompt_ids:
        return None
    return {"start": len(prompt_ids), "method": "the two-pass prompt prefix (prompt tokenized separately)"}


def normalise(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def expected_turn_end_marker(rendered: str, assistant_content: str) -> str | None:
    """The template's own text between the assistant content and the end of the sequence."""
    position = rendered.rfind(assistant_content)
    if position < 0:
        return None
    tail = rendered[position + len(assistant_content) :]
    marker = tail.strip().splitlines()[0].strip() if tail.strip() else ""
    return marker or None


def decode_piece(tokenizer, token_id: int) -> str:
    return tokenizer.decode([token_id], skip_special_tokens=False)


def build_artifact(args: argparse.Namespace, tokenizer, rows_path: str, index: int, row: dict) -> tuple[str, bool]:
    messages = row["messages"]
    try:
        input_ids, labels = render_and_mask(tokenizer, messages)
    except Exception as exc:
        raise SystemExit(
            f"tokenize_inspect.py: chat_mask.render_and_mask failed on {row_id(row)}: "
            f"{type(exc).__name__}: {exc}"
        ) from exc
    input_ids = list(input_ids)
    labels = list(labels)
    if len(input_ids) != len(labels):
        raise SystemExit(
            f"tokenize_inspect.py: chat_mask.py returned {len(input_ids)} input_ids but {len(labels)} labels"
        )

    assistant_content = str(messages[-1]["content"])
    system_content = str(messages[0]["content"]) if messages[0].get("role") == "system" else ""
    user_content = next((str(message["content"]) for message in messages if message["role"] == "user"), "")

    rendered = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)
    span = loss_span(labels)
    template_span = template_assistant_span(tokenizer, messages)
    prefix_span = None if template_span else prefix_method_start(tokenizer, messages, input_ids)
    independent = template_span or prefix_span

    lines: list[str] = []
    lines.append("tokenize_inspect.py — loss-mask artifact (training/PLAN.md task T5c)")
    lines.append("")
    lines.append("chat profile      : compiled-plan-chat-1")
    lines.append(f"systemPromptSha256: {hashlib.sha256(system_content.encode('utf-8')).hexdigest()}")
    revision = tokenizer_revision(tokenizer) or "unknown"
    lines.append(f"model             : {args.model} (revision {revision}, {type(tokenizer).__name__})")
    lines.append(f"rows              : {rows_path}")
    lines.append(f"row index         : {index}")
    lines.append(f"folder            : {row_id(row)}")
    lines.append(f"sequence length   : {len(input_ids)} tokens (chat template, add_generation_prompt=False)")
    lines.append("")
    lines.append("--- rendered conversation (apply_chat_template, tokenize=False) ---")
    lines.append(rendered)
    lines.append("--- end rendered conversation ---")
    lines.append("")
    lines.append("--- tokens (state: loss = label != -100, masked = label == -100) ---")
    lines.append(f"{'idx':>6}  {'token_id':>8}  {'state':<6}  piece")
    for position, token_id in enumerate(input_ids):
        state = "loss" if labels[position] != -100 else "masked"
        lines.append(f"{position:>6}  {token_id:>8}  {state:<6}  {decode_piece(tokenizer, token_id)!r}")
    lines.append("")
    lines.append(f"loss-bearing tokens: {sum(1 for label in labels if label != -100)} of {len(labels)} (assistant tokens only)")
    lines.append("")
    lines.append("--- mask verification ---")

    checks: list[tuple[str, str, str]] = []
    problems: list[str] = []

    if span is None:
        checks.append(("mask non-empty", "NO", "every label is -100: the row carries no training signal"))
        problems.append("the loss mask is empty")
    else:
        checks.append(
            (
                "mask non-empty",
                "YES",
                f"{span['count']} loss-bearing tokens, span [{span['start']}, {span['end']})",
            )
        )
        checks.append(
            (
                "mask contiguous",
                "YES" if span["contiguous"] else "NO",
                "one uninterrupted run" if span["contiguous"] else "the loss-bearing indices have gaps",
            )
        )
        if not span["contiguous"]:
            problems.append("the loss mask is not contiguous")

        span_text = tokenizer.decode(input_ids[span["start"] : span["end"]], skip_special_tokens=False)
        span_norm = normalise(span_text)
        assistant_head = normalise(assistant_content)[:80]
        if independent:
            start_ok = span["start"] == independent["start"]
            independent_note = f"{independent['method']} puts the assistant content at token {independent['start']}"
        else:
            start_ok = bool(assistant_head) and span_norm.startswith(assistant_head)
            independent_note = "no template or prefix check available; compared the decoded span with the content"
        checks.append(
            (
                "span starts at the assistant content",
                "YES" if start_ok else "NO",
                f"measured start {span['start']}; {independent_note}; decoded span starts {span_norm[:60]!r}",
            )
        )
        if not start_ok:
            problems.append("the loss span does not start at the assistant content")

        system_head = normalise(system_content)[:80]
        user_head = normalise(user_content)[:80]
        leaks = []
        if system_head and system_head in span_norm:
            leaks.append("system prompt text")
        if user_head and user_head in span_norm:
            leaks.append("user statement text")
        coverage_ok = start_ok and not leaks
        checks.append(
            (
                "span covers only assistant text",
                "YES" if coverage_ok else "NO",
                "neither system nor user text appears in the decoded span"
                if not leaks
                else "the decoded span contains " + " and ".join(leaks),
            )
        )
        if not coverage_ok:
            problems.append("the loss span covers non-assistant text (" + (", ".join(leaks) or "wrong start") + ")")

        marker = expected_turn_end_marker(rendered, assistant_content)
        closing_index = None
        for position in range(span["end"] - 1, span["start"] - 1, -1):
            piece = decode_piece(tokenizer, input_ids[position])
            if piece == marker or (marker is None and piece in TURN_END_FALLBACK_MARKERS):
                closing_index = position
                break
        if closing_index is None:
            ends_ok = False
            last_piece = decode_piece(tokenizer, input_ids[span["end"] - 1])
            end_evidence = (
                f"no closing end-of-turn token inside the span (the template's own tail marker is {marker!r}); "
                f"the last loss-bearing token {input_ids[span['end'] - 1]} decodes to {last_piece!r}"
            )
            end_problem = "the loss span does not end at the closing end-of-turn token"
        elif closing_index == span["end"] - 1:
            ends_ok = True
            end_evidence = (
                f"the last loss-bearing token {input_ids[closing_index]} decodes to "
                f"{decode_piece(tokenizer, input_ids[closing_index])!r}"
                + (" and is the template's own tail marker" if marker else "")
            )
            end_problem = None
        else:
            overhang = span["end"] - 1 - closing_index
            extra = tokenizer.decode(input_ids[closing_index + 1 : span["end"]], skip_special_tokens=False)
            ends_ok = False
            end_evidence = (
                f"the closing end-of-turn token {input_ids[closing_index]} is at index {closing_index}, "
                f"but the span continues for {overhang} more token(s) decoding to {extra!r}"
            )
            end_problem = (
                f"the loss span carries {overhang} token(s) of template text after the closing "
                f"end-of-turn token ({extra!r})"
            )
        checks.append(
            ("span ends with the closing end-of-turn token", "YES" if ends_ok else "NO", end_evidence)
        )
        if end_problem:
            problems.append(end_problem)

        tail = tokenizer.decode(input_ids[span["end"] :], skip_special_tokens=False)
        tail_ok = tail.strip() == ""
        if not tail:
            tail_evidence = "the sequence ends at the span"
        elif tail_ok:
            tail_evidence = f"only template whitespace follows the span ({tail!r})"
        else:
            tail_evidence = f"the span is followed by {tail!r}"
        checks.append(
            (
                "nothing but whitespace follows the span",
                "YES" if tail_ok else "NO",
                tail_evidence,
            )
        )
        if not tail_ok:
            problems.append("the sequence carries text after the closing end-of-turn token")

    for name, result, evidence in checks:
        lines.append(f"{name:<{CHECK_WIDTH}} {result:<4} {evidence}")
    lines.append("")

    if problems:
        lines.append(f"VERDICT: FAIL — {'; '.join(problems)}.")
        lines.append(
            "The assistant target is the assistant content plus its closing end-of-turn token and nothing else "
            "(training/PLAN.md T5c, DS009): fix training/python/chat_mask.py before trusting the overfit run."
        )
        if all(problem.startswith("the loss span carries") for problem in problems):
            lines.append(
                "The only deviation is template whitespace after the closing turn token: either stop the mask at "
                "the closing turn token in training/python/chat_mask.py, or record the accepted deviation in the "
                "registry note."
            )
    else:
        lines.append(
            "VERDICT: OK — loss falls exactly on the assistant content and its closing end-of-turn token, "
            "and on nothing else: system text, user statement, and template filler are masked."
        )
    lines.append("reviewer sign-off: ______________________________  (date: __________)")

    return "\n".join(lines) + "\n", not problems


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    try:
        from transformers import AutoTokenizer
    except ImportError as exc:  # pragma: no cover - environment error path
        raise SystemExit(
            f"tokenize_inspect.py: transformers is not importable ({exc}).\n"
            "Run training/environment/setup.sh and use training/.venv (training/PLAN.md T1)."
        )

    index, row = select_row(load_rows(args.rows), args.folder, args.index)
    tokenizer = AutoTokenizer.from_pretrained(args.model)
    tokenizer.clean_up_tokenization_spaces = False

    artifact, ok = build_artifact(args, tokenizer, args.rows, index, row)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as handle:
        handle.write(artifact)

    print(f"wrote {out_path} ({row_id(row)})")
    if not ok:
        for line in artifact.splitlines():
            if line.startswith("VERDICT:"):
                print(line, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
