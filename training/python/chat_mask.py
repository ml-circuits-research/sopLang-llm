#!/usr/bin/env python3
"""Assistant-only loss masks for the compiled-plan chat profile.

This module implements the loss-mask contract of training/PLAN.md (task T5b,
decisions D5/D7/D8) and of docs/specs/DS009-fine-tuning-and-evaluation.md
("the target loss is computed on assistant tokens, and padding tokens, system
content, and user content are masked from the language-model loss"): every
non-assistant token carries :data:`LOSS_IGNORE_INDEX` (-100), while the
assistant content tokens and the assistant closing turn token keep their real
token ids and are the only tokens that contribute to the loss.

The loss span ends exactly at the assistant closing turn token
(:data:`CLOSING_TURN_TOKEN`, ``<|im_end|>`` for Qwen2.5) and never after it:
the newline separator that the template prints between turns is masked, which is
the span the model's own ``return_assistant_tokens_mask=True`` path marks (the
separator lies outside the template's generation block).

``render_and_mask`` is the single entry point used by the trainer
(``training/python/sft_train.py``) and by the mask inspector
(``training/python/tokenize_inspect.py``), so both agree on the boundary by
construction.

The base model of the first milestone is Qwen2.5-Coder-0.5B-Instruct
(PLAN.md D2). Its repository chat template contains no ``{% generation %}``
blocks, so ``apply_chat_template(..., return_assistant_tokens_mask=True)``
returns an all-zero mask for it (transformers warns once that the template
lacks the keyword), and the two-pass prefix path supplies the labels. The
template mask is still requested: when a future tokenizer provides one, it is
used for the labels of the span and must agree with the prefix path, otherwise
the call raises instead of guessing.

The prefix path renders the prompt with ``add_generation_prompt=True``, renders
the full conversation with ``add_generation_prompt=False``, and takes the
longest common token prefix of the two renderings as the start of the assistant
turn. The prefix property was verified on all 6775 rows of
``training/data/all-books.jsonl`` (the prompt rendering is a character prefix of
the full rendering, and its tokens are the token prefix of the full rendering),
so no row needs truncation and no row is ever clipped (D7).

Self-check (prints the boundary tokens and their labels for one example row)::

    training/.venv/bin/python training/python/chat_mask.py \
        training/models/qwen2.5-coder-0.5b-instruct
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

#: Label value that removes a token from the language-model loss (PyTorch
#: ``CrossEntropyLoss`` ignore index).
LOSS_IGNORE_INDEX = -100

#: Closing turn token of the Qwen2.5 chat template; the loss span ends here
#: (PLAN.md T5b).
CLOSING_TURN_TOKEN = "<|im_end|>"

ASSISTANT_ROLE = "assistant"


def _common_prefix_length(left: list[int], right: list[int]) -> int:
    """Number of leading positions where two token sequences are identical."""
    length = 0
    for left_id, right_id in zip(left, right):
        if left_id != right_id:
            break
        length += 1
    return length


def _token_at(tokenizer, input_ids: list[int], index: int) -> str:
    """Human-readable description of one position, used in error messages."""
    if index >= len(input_ids):
        return "end of sequence"
    token_id = input_ids[index]
    return f"id {token_id} = {tokenizer.decode([token_id])!r}"


def _validate_messages(messages) -> None:
    if not isinstance(messages, (list, tuple)) or not messages:
        raise ValueError("messages must be a non-empty list of role/content dicts")
    for index, message in enumerate(messages):
        if not isinstance(message, dict) or "role" not in message or "content" not in message:
            raise ValueError(f"messages[{index}] must be a dict with 'role' and 'content'")
        if not isinstance(message["content"], str):
            raise ValueError(f"messages[{index}]['content'] must be a string")
    if messages[-1]["role"] != ASSISTANT_ROLE:
        raise ValueError(
            "the last message must be the assistant target: "
            f"got role {messages[-1]['role']!r}"
        )


def _closing_turn_token_id(tokenizer) -> int:
    """Token id of the closing turn token, or an error when the tokenizer lacks it."""
    token_id = tokenizer.convert_tokens_to_ids(CLOSING_TURN_TOKEN)
    if not isinstance(token_id, int) or token_id < 0 or token_id == tokenizer.unk_token_id:
        raise ValueError(
            f"the tokenizer of {getattr(tokenizer, 'name_or_path', '?')} has no "
            f"{CLOSING_TURN_TOKEN!r} token, so the end of the assistant turn cannot be located; "
            "the compiled-plan profile uses the Qwen2.5 chat template"
        )
    return token_id


def _labels_from_span(input_ids: list[int], start: int, end: int) -> list[int]:
    """Real ids on ``[start, end]`` inclusive, :data:`LOSS_IGNORE_INDEX` elsewhere."""
    return [
        token_id if start <= index <= end else LOSS_IGNORE_INDEX
        for index, token_id in enumerate(input_ids)
    ]


def _render_with_template_mask(tokenizer, messages):
    """Return ``(input_ids, assistant_mask)`` from the template's generation tags.

    Returns ``None`` when the tokenizer cannot provide an assistant mask: when the
    call raises, when the result carries no ``assistant_masks`` entry, or when the
    call returns a batched (nested) layout.
    """
    try:
        rendered = tokenizer.apply_chat_template(
            messages,
            tokenize=True,
            return_assistant_tokens_mask=True,
            return_dict=True,
            add_generation_prompt=False,
        )
    except Exception:
        return None
    try:
        input_ids = list(rendered["input_ids"])
        assistant_mask = list(rendered["assistant_masks"])
    except (TypeError, KeyError, IndexError):
        return None
    if input_ids and isinstance(input_ids[0], (list, tuple)):
        return None
    return input_ids, assistant_mask


def _mask_start(input_ids: list[int], assistant_mask: list[int]) -> int | None:
    """First position the template mask marks, or ``None`` when unusable.

    The mask is unusable when it does not align with the sequence, marks nothing,
    or marks the very first token (which would mean it also covers the prompt).
    """
    if len(assistant_mask) != len(input_ids):
        return None
    marked = [index for index, flag in enumerate(assistant_mask) if flag]
    if not marked:
        return None
    start = marked[0]
    if start == 0:
        return None
    return start


def _render_pair(tokenizer, messages) -> tuple[str, str]:
    """Render the prompt-only and the full conversation strings."""
    prompt_text = tokenizer.apply_chat_template(
        list(messages[:-1]), tokenize=False, add_generation_prompt=True
    )
    full_text = tokenizer.apply_chat_template(
        list(messages), tokenize=False, add_generation_prompt=False
    )
    return prompt_text, full_text


def _encode_text(tokenizer, text: str) -> list[int]:
    """Tokenize an already-templated string without adding special tokens."""
    return list(tokenizer(text, add_special_tokens=False)["input_ids"])


def _prefix_boundary(tokenizer, messages) -> tuple[list[int], int]:
    """Two-pass prefix method: the tokenized conversation and the assistant start."""
    prompt_text, full_text = _render_pair(tokenizer, messages)
    full_ids = _encode_text(tokenizer, full_text)
    prompt_ids = _encode_text(tokenizer, prompt_text)

    boundary = _common_prefix_length(full_ids, prompt_ids)
    if boundary != len(prompt_ids):
        raise ValueError(
            "chat template prefix property broken: the prompt-only rendering is not a "
            f"token prefix of the full rendering; they diverge at index {boundary} "
            f"({_token_at(tokenizer, prompt_ids, boundary)} in the prompt vs "
            f"{_token_at(tokenizer, full_ids, boundary)} in the full conversation), "
            "so the loss boundary cannot be derived by prefixing"
        )
    if boundary == 0:
        raise ValueError("the rendered conversation has no prompt tokens to mask")
    if boundary >= len(full_ids):
        raise ValueError(
            "the rendered conversation has no assistant tokens after the prompt: "
            f"the assistant content of the last message is empty or the template "
            f"adds no <|im_start|>assistant turn ({len(full_ids)} tokens)"
        )
    return full_ids, boundary


def _closing_turn_index(tokenizer, input_ids: list[int], start: int) -> int:
    """Last position of the closing turn token at or after the assistant start."""
    closing_id = _closing_turn_token_id(tokenizer)
    for index in range(len(input_ids) - 1, start - 1, -1):
        if input_ids[index] == closing_id:
            return index
    raise ValueError(
        f"the rendered assistant turn has no {CLOSING_TURN_TOKEN!r} token after the prompt boundary "
        f"({_token_at(tokenizer, input_ids, start)}); the loss span has no defined end"
    )


def render_and_mask(tokenizer, messages: list[dict]) -> tuple[list[int], list[int]]:
    """Render a conversation and build the assistant-only loss labels.

    The conversation is rendered with the base model's own chat template and
    ``add_generation_prompt=False``, so the example ends with the assistant turn
    including its closing turn token (``<|im_end|>`` for Qwen2.5).

    Returns ``(input_ids, labels)`` with ``len(labels) == len(input_ids)``; every
    non-assistant token has label :data:`LOSS_IGNORE_INDEX` and the assistant
    content tokens plus the assistant closing turn token carry their real ids.
    Nothing after the closing turn token carries a label.
    """
    _validate_messages(messages)

    input_ids, start = _prefix_boundary(tokenizer, messages)
    end = _closing_turn_index(tokenizer, input_ids, start)
    prefix_labels = _labels_from_span(input_ids, start, end)

    rendered = _render_with_template_mask(tokenizer, messages)
    if rendered is None:
        return input_ids, prefix_labels

    mask_ids, assistant_mask = rendered
    if mask_ids != input_ids:
        raise ValueError(
            "the template assistant mask and the two-pass prefix rendering tokenize the same "
            f"conversation differently ({len(mask_ids)} vs {len(input_ids)} tokens)"
        )
    mask_start = _mask_start(mask_ids, assistant_mask)
    if mask_start is None or not assistant_mask[end]:
        # An empty mask (Qwen2.5 declares no {% generation %} block) or a mask that
        # stops before the closing turn token: the prefix labels stand.
        return input_ids, prefix_labels
    if mask_start != start:
        raise ValueError(
            f"the template assistant mask starts at token {mask_start} "
            f"({_token_at(tokenizer, mask_ids, mask_start)}) while the two-pass prefix method puts "
            f"the assistant turn at token {start} ({_token_at(tokenizer, input_ids, start)}); "
            "refusing to guess the loss boundary"
        )
    # The mask supplies the labels of the span [start, end]; the trim guarantees
    # that nothing after the closing turn token carries a label.
    return input_ids, [
        token_id if (flag and start <= index <= end) else LOSS_IGNORE_INDEX
        for index, (token_id, flag) in enumerate(zip(input_ids, assistant_mask))
    ]


def _loss_region_bounds(labels: list[int]) -> tuple[int, int]:
    """First and last index carrying a real label."""
    kept = [index for index, label in enumerate(labels) if label != LOSS_IGNORE_INDEX]
    if not kept:
        raise ValueError("the rendered row has no loss-bearing token")
    return kept[0], kept[-1]


def _main(argv: list[str]) -> int:
    training_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(
        description=(
            "Render one training row with the base model's chat template and print the "
            "loss boundary so a human can confirm that loss starts at the assistant "
            "content and ends at the closing turn token (PLAN.md T5c)."
        )
    )
    parser.add_argument(
        "model", help="local base model directory holding the tokenizer (PLAN.md D2)"
    )
    parser.add_argument(
        "--data",
        default=str(training_root / "data" / "all-books.jsonl"),
        help="JSONL export to take the example row from",
    )
    parser.add_argument("--row", type=int, default=0, help="zero-based row index")
    parser.add_argument(
        "--window", type=int, default=10, help="token lines printed around the boundary"
    )
    args = parser.parse_args(argv)

    from transformers import AutoTokenizer

    tokenizer = AutoTokenizer.from_pretrained(args.model)

    data_path = Path(args.data)
    with data_path.open(encoding="utf-8") as handle:
        rows = [json.loads(line) for line in handle if line.strip()]
    row = rows[args.row]
    messages = row["messages"]
    meta = row.get("meta", {})

    input_ids, labels = render_and_mask(tokenizer, messages)
    start, end = _loss_region_bounds(labels)

    masked_tokens = sum(1 for label in labels if label == LOSS_IGNORE_INDEX)
    loss_tokens = len(labels) - masked_tokens
    prefix_text = tokenizer.decode(input_ids[:start])
    loss_text = tokenizer.decode(input_ids[start : end + 1])
    tail_text = tokenizer.decode(input_ids[end + 1 :])
    target = messages[-1]["content"]

    print(f"data:       {data_path} row {args.row}")
    print(f"row:        {meta.get('book', '?')}/{meta.get('folder', '?')}")
    print(f"template:   {tokenizer.chat_template is not None}")
    print(f"tokens:     {len(input_ids)} total, {masked_tokens} masked, {loss_tokens} loss-bearing")
    print(f"loss span:  [{start}, {end}] of [0, {len(input_ids) - 1}]")
    print(f"masked prefix ends with:  {prefix_text[-60:]!r}")
    print(f"loss span starts with:    {loss_text[:60]!r}")
    print(f"loss span ends with:      {loss_text[-40:]!r}")
    print(f"tokens after the closing turn token (masked): {len(input_ids) - end - 1} -> {tail_text!r}")
    print(
        "loss span equals '<assistant content><|im_end|>': "
        f"{loss_text == target + CLOSING_TURN_TOKEN}"
    )
    print()
    print("    index        id  label      piece")
    low = max(0, start - args.window)
    high = min(len(input_ids), end + 2 + args.window)
    for index in range(low, high):
        label = labels[index]
        label_text = "IGNORE" if label == LOSS_IGNORE_INDEX else str(label)
        if index == start:
            marker = " <- boundary (assistant content starts)"
        elif index == end:
            marker = " <- closing turn token (loss ends here)"
        elif index == end + 1:
            marker = " <- template separator, masked"
        else:
            marker = ""
        piece = tokenizer.decode([input_ids[index]])
        print(f"{index:9d} {input_ids[index]:9d} {label_text:>8}  {piece!r}{marker}")
    print()

    problems = []
    for index in range(start):
        if labels[index] != LOSS_IGNORE_INDEX:
            problems.append(f"token {index} before the boundary is not masked")
    for index in range(start, end + 1):
        if labels[index] != input_ids[index]:
            problems.append(f"token {index} in the assistant turn does not carry its id")
    for index in range(end + 1, len(input_ids)):
        if labels[index] != LOSS_IGNORE_INDEX:
            problems.append(f"token {index} after the closing turn token is not masked")
    if labels[end] != input_ids[end]:
        problems.append("the closing turn token does not carry its id")
    if problems:
        for problem in problems:
            print(f"FAIL: {problem}", file=sys.stderr)
        return 1
    print(
        "OK: loss covers exactly the assistant content and its closing turn token; "
        "the prompt and the template separator after the turn are masked"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv[1:]))
