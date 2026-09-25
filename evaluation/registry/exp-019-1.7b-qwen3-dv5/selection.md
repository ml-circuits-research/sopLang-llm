# Checkpoint selection, exp-019-1.7b-qwen3-dv5

Validation slice: 339 rows, selected by the D11 slice of `training/data/validation-slice.json`.
Every checkpoint is converted to an F16 GGUF (no quantization during selection) and scored with the full evaluation loop:
greedy decoding, one attempt, the recorded post-processing contract, then parse, graph, execution, and oracle comparison.

323 of 339 slice rows sit on a plan fingerprint that also occurs in the rows the trainer trains on, and 16 are on plans that occur nowhere else; DS009 requires the table to report oracle match for the two groups separately, because the first group measures recall of a known plan and only the second measures compilation of an unseen one. The winner is still chosen by overall oracle match, so selection stays comparable across experiments.

| checkpoint | step | oracle match | oracle match (plan seen) | oracle match (plan unseen) | parse validity | graph validity | runtime completion | items |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| checkpoint-450 | 450 | 95.0% | n/a | n/a | 100.0% | 100.0% | 99.4% | 339 |
| checkpoint-487 | 487 | 95.0% | 98.1% (323) | 31.3% (16) | 100.0% | 100.0% | 99.4% | 339 |
| checkpoint-600 | 600 | 95.0% | 98.1% (323) | 31.3% (16) | 100.0% | 100.0% | 99.4% | 339 |
| checkpoint-642 | 642 | 95.0% | 98.1% (323) | 31.3% (16) | 100.0% | 100.0% | 99.4% | 339 |
| checkpoint-300 | 300 | 94.4% | n/a | n/a | 100.0% | 100.0% | 98.5% | 339 |
| checkpoint-150 | 150 | 71.1% | n/a | n/a | 100.0% | 100.0% | 91.4% | 339 |

Selected: **checkpoint-450** (highest oracle match, parse validity as the tiebreaker; training loss is never used for selection).

| class | items (selected checkpoint) |
| --- | --- |
| _reused in-loop score_ | _the holdout is the authoritative class table_ |

Per-item records: `selection/<checkpoint>.jsonl`.
