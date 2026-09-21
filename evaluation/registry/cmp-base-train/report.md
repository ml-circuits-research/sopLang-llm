# Slice run — cmp-base-train

Artifact: `/home/salboaie/work/sopLang-llm/training/checkpoints/base-f16.gguf`. Slice: comparison-slice (1000 items, training/data/comparison-slice.jsonl).

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 39 | 1000 | 3.9% |
| graph validity | 39 | 1000 | 3.9% |
| runtime completion | 0 | 1000 | 0.0% |
| oracle match | 0 | 1000 | 0.0% |

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 186 |
| parse_invalid | 775 |
| graph_invalid | 0 |
| execution_error | 39 |
| answer_mismatch | 0 |
| answer_match | 0 |

Per-item records: `items/comparison-slice.jsonl`.
