# Checkpoint selection, exp-004-lora

Validation slice: 339 rows, selected by the D11 slice of `training/data/validation-slice.json`.
Every checkpoint is converted to an F16 GGUF (no quantization during selection) and scored with the full evaluation loop:
greedy decoding, one attempt, the recorded post-processing contract, then parse, graph, execution, and oracle comparison.

323 of 339 slice rows sit on a plan fingerprint that also occurs in the rows the trainer trains on, and 16 are on plans that occur nowhere else; DS009 requires the table to report oracle match for the two groups separately, because the first group measures recall of a known plan and only the second measures compilation of an unseen one. The winner is still chosen by overall oracle match, so selection stays comparable across experiments.

| checkpoint | step | oracle match | oracle match (plan seen) | oracle match (plan unseen) | parse validity | graph validity | runtime completion | items |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| checkpoint-540 | 540 | 52.5% | 54.2% (323) | 18.8% (16) | 100.0% | 100.0% | 74.6% | 339 |
| checkpoint-606 | 606 | 52.2% | 53.9% (323) | 18.8% (16) | 100.0% | 100.0% | 74.9% | 339 |
| checkpoint-450 | 450 | 50.1% | 51.7% (323) | 18.8% (16) | 100.0% | 99.7% | 72.9% | 339 |
| checkpoint-360 | 360 | 42.5% | 44.0% (323) | 12.5% (16) | 100.0% | 100.0% | 66.4% | 339 |
| checkpoint-270 | 270 | 36.0% | 37.2% (323) | 12.5% (16) | 100.0% | 100.0% | 64.3% | 339 |
| checkpoint-180 | 180 | 23.3% | 23.8% (323) | 12.5% (16) | 100.0% | 99.7% | 57.2% | 339 |
| checkpoint-90 | 90 | 2.7% | 2.5% (323) | 6.3% (16) | 100.0% | 99.1% | 47.2% | 339 |

Selected: **checkpoint-540** (highest oracle match, parse validity as the tiebreaker; training loss is never used for selection).

| class | items (selected checkpoint) |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 86 |
| answer_mismatch | 75 |
| answer_match | 178 |

Per-item records: `selection/<checkpoint>.jsonl`.
