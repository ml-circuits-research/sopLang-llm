# Checkpoint selection, exp-013-1.5b

Validation slice: 339 rows, selected by the D11 slice of `training/data/validation-slice.json`.
Every checkpoint is converted to an F16 GGUF (no quantization during selection) and scored with the full evaluation loop:
greedy decoding, one attempt, the recorded post-processing contract, then parse, graph, execution, and oracle comparison.

323 of 339 slice rows sit on a plan fingerprint that also occurs in the rows the trainer trains on, and 16 are on plans that occur nowhere else; DS009 requires the table to report oracle match for the two groups separately, because the first group measures recall of a known plan and only the second measures compilation of an unseen one. The winner is still chosen by overall oracle match, so selection stays comparable across experiments.

| checkpoint | step | oracle match | oracle match (plan seen) | oracle match (plan unseen) | parse validity | graph validity | runtime completion | items |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| checkpoint-450 | 450 | 94.7% | 98.1% (323) | 25.0% (16) | 100.0% | 100.0% | 98.5% | 339 |
| checkpoint-540 | 540 | 94.4% | 97.8% (323) | 25.0% (16) | 100.0% | 100.0% | 99.4% | 339 |
| checkpoint-630 | 630 | 94.4% | 98.1% (323) | 18.8% (16) | 100.0% | 100.0% | 98.8% | 339 |
| checkpoint-720 | 720 | 94.4% | 98.1% (323) | 18.8% (16) | 100.0% | 100.0% | 99.1% | 339 |
| checkpoint-810 | 810 | 94.4% | 98.1% (323) | 18.8% (16) | 100.0% | 100.0% | 99.1% | 339 |
| checkpoint-900 | 900 | 94.4% | 98.1% (323) | 18.8% (16) | 100.0% | 100.0% | 99.1% | 339 |
| checkpoint-912 | 912 | 94.4% | 98.1% (323) | 18.8% (16) | 100.0% | 100.0% | 99.1% | 339 |
| checkpoint-360 | 360 | 93.8% | 97.2% (323) | 25.0% (16) | 100.0% | 100.0% | 97.3% | 339 |
| checkpoint-362 | 362 | 93.2% | 96.9% (323) | 18.8% (16) | 100.0% | 100.0% | 97.9% | 339 |
| checkpoint-270 | 270 | 90.6% | 93.8% (323) | 25.0% (16) | 100.0% | 100.0% | 96.2% | 339 |
| checkpoint-180 | 180 | 73.5% | 76.5% (323) | 12.5% (16) | 99.7% | 99.7% | 88.2% | 339 |
| checkpoint-90 | 90 | 36.3% | 37.2% (323) | 18.8% (16) | 100.0% | 100.0% | 69.6% | 339 |
| checkpoint-1 | 1 | 0.0% | 0.0% (323) | 0.0% (16) | 0.3% | 0.3% | 0.0% | 339 |

Selected: **checkpoint-450** (highest oracle match, parse validity as the tiebreaker; training loss is never used for selection).

| class | items (selected checkpoint) |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 5 |
| answer_mismatch | 13 |
| answer_match | 321 |

Per-item records: `selection/<checkpoint>.jsonl`.
