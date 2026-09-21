# Adaptation run — adapt-holdout-1

Artifact: `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540.gguf (exp-003-sft-lr1e-4 checkpoint-540)`. Slice: holdout (265 items). Demonstrations in the prompt: **1**.

| metric | rate | items |
| --- | --- | --- |
| answer_match | 0.0% | 0 |
| answer_mismatch | 10.6% | 28 |
| execution_error | 89.4% | 237 |
| wrapper_rejected | 0.0% | 0 |
| generation_transport_error | 0.0% | 0 |

Each prompt carries 1 compiled examples drawn from the training rows in export order, never from the target's own book, so the demonstration teaches the protocol rather than the answer.

Per-item records: `items/holdout.jsonl` (each record names the demonstrations it received).
