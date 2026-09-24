# Checkpoint selection, exp-015-deep-chains-05

Validation slice: 339 rows, selected by the D11 slice of `training/data/validation-slice.json`.
Every checkpoint is converted to an F16 GGUF (no quantization during selection) and scored with the full evaluation loop:
greedy decoding, one attempt, the recorded post-processing contract, then parse, graph, execution, and oracle comparison.

323 of 339 slice rows sit on a plan fingerprint that also occurs in the rows the trainer trains on, and 16 are on plans that occur nowhere else; DS009 requires the table to report oracle match for the two groups separately, because the first group measures recall of a known plan and only the second measures compilation of an unseen one. The winner is still chosen by overall oracle match, so selection stays comparable across experiments.

| checkpoint | step | oracle match | oracle match (plan seen) | oracle match (plan unseen) | parse validity | graph validity | runtime completion | items |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| checkpoint-600 | 600 | 94.7% | 97.8% (323) | 31.3% (16) | 100.0% | 100.0% | 98.8% | 339 |
| checkpoint-630 | 630 | 94.7% | 97.8% (323) | 31.3% (16) | 100.0% | 100.0% | 98.8% | 339 |
| checkpoint-450 | 450 | 94.1% | 97.5% (323) | 25.0% (16) | 100.0% | 100.0% | 98.5% | 339 |
| checkpoint-300 | 300 | 91.2% | 94.7% (323) | 18.8% (16) | 100.0% | 100.0% | 97.9% | 339 |
| checkpoint-150 | 150 | 48.1% | 49.5% (323) | 18.8% (16) | 100.0% | 100.0% | 77.0% | 339 |

Selected: **checkpoint-600** (highest oracle match, parse validity as the tiebreaker; training loss is never used for selection).

| class | items (selected checkpoint) |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 4 |
| answer_mismatch | 14 |
| answer_match | 321 |

Per-item records: `selection/<checkpoint>.jsonl`.
