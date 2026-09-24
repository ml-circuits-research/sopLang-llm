# Checkpoint selection, exp-016-wires

Validation slice: 339 rows, selected by the D11 slice of `training/data/validation-slice.json`.
Every checkpoint is converted to an F16 GGUF (no quantization during selection) and scored with the full evaluation loop:
greedy decoding, one attempt, the recorded post-processing contract, then parse, graph, execution, and oracle comparison.

323 of 339 slice rows sit on a plan fingerprint that also occurs in the rows the trainer trains on, and 16 are on plans that occur nowhere else; DS009 requires the table to report oracle match for the two groups separately, because the first group measures recall of a known plan and only the second measures compilation of an unseen one. The winner is still chosen by overall oracle match, so selection stays comparable across experiments.

| checkpoint | step | oracle match | oracle match (plan seen) | oracle match (plan unseen) | parse validity | graph validity | runtime completion | items |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| checkpoint-600 | 600 | 96.2% | 99.4% (323) | 31.3% (16) | 100.0% | 100.0% | 99.7% | 339 |
| checkpoint-630 | 630 | 96.2% | 99.4% (323) | 31.3% (16) | 100.0% | 100.0% | 99.7% | 339 |
| checkpoint-450 | 450 | 95.6% | 98.8% (323) | 31.3% (16) | 100.0% | 100.0% | 99.7% | 339 |
| checkpoint-300 | 300 | 94.1% | 97.5% (323) | 25.0% (16) | 100.0% | 100.0% | 100.0% | 339 |
| checkpoint-301 | 301 | 94.1% | 97.5% (323) | 25.0% (16) | 100.0% | 100.0% | 100.0% | 339 |

Selected: **checkpoint-600** (highest oracle match, parse validity as the tiebreaker; training loss is never used for selection).

| class | items (selected checkpoint) |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 1 |
| answer_mismatch | 12 |
| answer_match | 326 |

Per-item records: `selection/<checkpoint>.jsonl`.
