# Checkpoint selection, exp-002-sft-lr2e-5

Validation slice: 339 rows, selected by the D11 slice of `training/data/validation-slice.json`.
Every checkpoint is converted to an F16 GGUF (no quantization during selection) and scored with the full evaluation loop:
greedy decoding, one attempt, the recorded post-processing contract, then parse, graph, execution, and oracle comparison.

| checkpoint | step | oracle match | parse validity | graph validity | runtime completion | items |
| --- | --- | --- | --- | --- | --- | --- |
| checkpoint-450 | 450 | 53.7% | 100.0% | 100.0% | 73.7% | 339 |
| checkpoint-451 | 451 | 53.7% | 100.0% | 100.0% | 74.6% | 339 |
| checkpoint-540 | 540 | 53.4% | 100.0% | 100.0% | 75.5% | 339 |
| checkpoint-606 | 606 | 53.1% | 100.0% | 100.0% | 74.6% | 339 |
| checkpoint-360 | 360 | 52.5% | 100.0% | 100.0% | 73.2% | 339 |
| checkpoint-270 | 270 | 48.7% | 100.0% | 100.0% | 74.3% | 339 |
| checkpoint-180 | 180 | 38.6% | 100.0% | 100.0% | 65.8% | 339 |
| checkpoint-90 | 90 | 12.1% | 100.0% | 100.0% | 56.3% | 339 |

Selected: **checkpoint-450** (highest oracle match, parse validity as the tiebreaker; training loss is never used for selection).

| class | items (selected checkpoint) |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 89 |
| answer_mismatch | 68 |
| answer_match | 182 |

Per-item records: `selection/<checkpoint>.jsonl`.
