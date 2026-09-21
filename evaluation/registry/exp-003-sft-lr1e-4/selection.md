# Checkpoint selection, exp-003-sft-lr1e-4

Validation slice: 339 rows, selected by the D11 slice of `training/data/validation-slice.json`.
Every checkpoint is converted to an F16 GGUF (no quantization during selection) and scored with the full evaluation loop:
greedy decoding, one attempt, the recorded post-processing contract, then parse, graph, execution, and oracle comparison.

| checkpoint | step | oracle match | parse validity | graph validity | runtime completion | items |
| --- | --- | --- | --- | --- | --- | --- |
| checkpoint-540 | 540 | 94.7% | 100.0% | 100.0% | 99.1% | 339 |
| checkpoint-606 | 606 | 94.7% | 100.0% | 100.0% | 98.8% | 339 |
| checkpoint-450 | 450 | 94.4% | 100.0% | 100.0% | 99.1% | 339 |
| checkpoint-360 | 360 | 94.1% | 100.0% | 100.0% | 98.8% | 339 |
| checkpoint-270 | 270 | 93.2% | 100.0% | 100.0% | 97.9% | 339 |
| checkpoint-180 | 180 | 84.7% | 100.0% | 100.0% | 95.3% | 339 |
| checkpoint-90 | 90 | 30.1% | 100.0% | 100.0% | 60.8% | 339 |

Selected: **checkpoint-540** (highest oracle match, parse validity as the tiebreaker; training loss is never used for selection).

| class | items (selected checkpoint) |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 3 |
| answer_mismatch | 15 |
| answer_match | 321 |

Per-item records: `selection/<checkpoint>.jsonl`.
