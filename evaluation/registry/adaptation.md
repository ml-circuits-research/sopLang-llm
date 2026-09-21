# Adaptation from demonstrated plans (2026-09-21)

Question: can the student compile a problem of a type it never saw when the prompt carries solved examples of other types? The measurement uses the same 265 holdout problems and the same served artifact for every arm — the best-measured checkpoint, `evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540.gguf` (exp-003 checkpoint-540) — and only the prompt changes.

| run | examples in the prompt | answered correctly | wrong answer | plan failed to execute |
| --- | --- | --- | --- | --- |
| `adapt-holdout-0` | none | **0 of 265** | 97 | 168 |
| `adapt-holdout-1` | 1 solved problem | **0 of 265** | 28 | 237 |
| `adapt-holdout-3` | 3 solved problems | **0 of 265** | 26 | 239 |

The examples came from the training rows in export order, from books other than the target's own book, with distinct types; each per-item record names the demonstrations it received (`items/holdout.jsonl` in each folder). The slice is the holdout: 225 book problems plus the 40 instances of the synthetic family the dataset withholds, and none of their types occurs in a training row.

What the numbers say, without interpretation: no arm answered a single holdout problem correctly, and adding examples moved the failures from "the plan runs and gives a wrong answer" to "the plan fails at run time" — 168 to 239 failures at execution out of 265. Reproduction: `node evaluation/run-adaptation.mjs --experiment adapt-holdout-<N> --best --slice holdout --demos <N>`.
