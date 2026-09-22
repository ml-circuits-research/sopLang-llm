# Checkpoint selection, exp-009-mix10

Validation slice: 339 rows, selected by the D11 slice of `training/data/validation-slice.json`.
Every checkpoint is converted to an F16 GGUF (no quantization during selection) and scored with the full evaluation loop:
greedy decoding, one attempt, the recorded post-processing contract, then parse, graph, execution, and oracle comparison.

323 of 339 slice rows sit on a plan fingerprint that also occurs in the rows the trainer trains on, and 16 are on plans that occur nowhere else; DS009 requires the table to report oracle match for the two groups separately, because the first group measures recall of a known plan and only the second measures compilation of an unseen one. The winner is still chosen by overall oracle match, so selection stays comparable across experiments.

| checkpoint | step | oracle match | oracle match (plan seen) | oracle match (plan unseen) | parse validity | graph validity | runtime completion | items |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| checkpoint-728 | 728 | 95.3% | 98.8% (323) | 25.0% (16) | 100.0% | 100.0% | 98.2% | 339 |
| checkpoint-540 | 540 | 95.0% | 99.1% (323) | 12.5% (16) | 100.0% | 100.0% | 99.1% | 339 |
| checkpoint-630 | 630 | 95.0% | 99.1% (323) | 12.5% (16) | 100.0% | 100.0% | 99.1% | 339 |
| checkpoint-593 | 593 | 94.4% | 98.5% (323) | 12.5% (16) | 100.0% | 100.0% | 97.6% | 339 |
| checkpoint-720 | 720 | 94.4% | 98.5% (323) | 12.5% (16) | 100.0% | 100.0% | 97.9% | 339 |
| checkpoint-747 | 747 | 94.4% | 98.5% (323) | 12.5% (16) | 100.0% | 100.0% | 97.9% | 339 |
| checkpoint-360 | 360 | 94.1% | 98.1% (323) | 12.5% (16) | 100.0% | 100.0% | 98.5% | 339 |
| checkpoint-361 | 361 | 94.1% | 98.5% (323) | 6.3% (16) | 100.0% | 100.0% | 97.3% | 339 |
| checkpoint-450 | 450 | 93.8% | 97.8% (323) | 12.5% (16) | 100.0% | 100.0% | 97.6% | 339 |
| checkpoint-270 | 270 | 90.6% | 94.1% (323) | 18.8% (16) | 100.0% | 100.0% | 96.2% | 339 |
| checkpoint-181 | 181 | 77.9% | 80.8% (323) | 18.8% (16) | 100.0% | 100.0% | 88.8% | 339 |
| checkpoint-198 | 198 | 77.6% | 80.5% (323) | 18.8% (16) | 100.0% | 100.0% | 89.4% | 339 |
| checkpoint-180 | 180 | 77.0% | 79.9% (323) | 18.8% (16) | 100.0% | 100.0% | 88.2% | 339 |
| checkpoint-90 | 90 | 36.3% | 36.8% (323) | 25.0% (16) | 100.0% | 100.0% | 59.3% | 339 |

Selected: **checkpoint-728** (highest oracle match, parse validity as the tiebreaker; training loss is never used for selection).

| class | items (selected checkpoint) |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 6 |
| answer_mismatch | 10 |
| answer_match | 323 |

Per-item records: `selection/<checkpoint>.jsonl`.
