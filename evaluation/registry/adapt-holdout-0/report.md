# Adaptation run — adapt-holdout-0

Artifact: `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540.gguf (exp-003-sft-lr1e-4 checkpoint-540)`. Slice: holdout (265 items). Demonstrations in the prompt: **0**.

| metric | rate | items |
| --- | --- | --- |
| answer_match | 0.0% | 0 |
| answer_mismatch | 36.6% | 97 |
| execution_error | 63.4% | 168 |
| wrapper_rejected | 0.0% | 0 |
| generation_transport_error | 0.0% | 0 |

The prompt is the recorded compiled-plan profile alone: the same measurement `evaluation/run-slice.mjs` reports for a slice.

Per-item records: `items/holdout.jsonl` (each record names the demonstrations it received).
