# exp-001-overfit — gate evidence (PLAN.md T5d)

Artifacts of this entry: the F16 GGUF of the final checkpoint
(`training/checkpoints/exp-001-overfit-f16.gguf`, 988 MB, converted in 3.8 s),
the served model `exp-001-overfit-f16` (llama-server, `--jinja`, four slots),
the per-item records `items/overfit-subset.jsonl` (300 items, greedy decoding,
one attempt per item, `max_tokens` 2048), `metrics.json`, and `report.md`.
The slice is `training/overfit/overfit-subset.jsonl`, the export-shaped view of
the T5a subset produced by `training/overfit/select.mjs`.

## Gate 1 — training loss below 0.05 with a strongly falling curve: FAIL

The 180-step run (20 epochs, lr 2e-5, effective batch 32, 284 examples,
3,192,889 target tokens) falls from 1.11 to 0.179 and plateaus: the last five
logged losses are 0.192, 0.177, 0.181, 0.182, 0.179 (steps 140-180), and the
optional early stop at 0.05 never fired. The curve falls strongly and then
flattens well above the near-memorization level the gate asks for. Evidence:
`training/checkpoints/exp-001-overfit/train-log.jsonl` (with the memory
columns) and `run-manifest.json` (`status: completed`, `final_loss: 0.17947`,
`peak_device_memory_gib: 28.754`).

## Gate 2 — at least 95% `answer_match` on the overfit items: FAIL

`evaluation/registry/exp-001-overfit/metrics.json`: 300 items, parse validity
100.0%, graph validity 99.7%, runtime completion 44.3%, oracle match 5.0%
(15/300; 15/284 on the rows the trainer actually saw, because 16 of the 300
subset folder ids fall in the D11 validation slice and were excluded from
training; those 16 score 0 matches). Failure classes over the trained rows:
`execution_error` 158, `answer_mismatch` 110, `answer_match` 15, `graph_invalid`
1. Generated length: median 502 tokens, mean 534, no truncation at the 2048
ceiling. Efficiency: 160,071 generated tokens, 61,913 prompt tokens, 300 calls,
108.55 tokens/s, cost per correct result 10,671 generated tokens.

## Gate 3 — served rendering equals the training rendering: PASS

For three items (`adult-reasoning`, `logical-reasoning`, `world-as-a-system`)
the server's `/apply-template` output equals
`tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)`
character for character (1601 chars for the first item), and the `/tokenize`
ids of the served prompt equal the trainer tokenizer's ids (353, 207, 213
tokens). The served chat template is the one converted into the GGUF metadata,
so inference and training render the same bytes.

## Diagnosis

The pipeline is aligned; the student is under-trained. Programs parse at 100%
and reproduce the per-case probe scaffolding of the targets verbatim, so the
profile, template, mask, and wrapper all transmit; the failures are
content-level. A representative `execution_error` shows a program whose
`slots` literal invents a `plans` structure where the target carries `messages`
with per-message `missing` lists, so the target's own `probe` calls fail inside
the `answer` wire; `answer_mismatch` cases execute but print a different answer.
This is the same gradient-budget limit the loss curve reports: 180 optimizer
steps at lr 2e-5 end while the loss is still near 0.18, so the boilerplate that
every row shares is learned and the per-row values are not.

The next experiment keeps the subset, the profile, and the recipe shape and
raises the budget on two axes only — lr 1e-4 and 40 epochs (lr is the axis D8
leaves open, and the first series planned lr 2e-5/1e-5 values the plateau now
puts in question). Its id is `exp-001-overfit-lr1e-4`, and it re-runs gates 1
and 2 before the first full run of T8, which the failing gates block.
