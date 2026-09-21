# Slice run — cmp-base-holdout

Artifact: `/home/salboaie/work/sopLang-llm/training/checkpoints/base-f16.gguf`. Slice: holdout (265 items, /home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop).

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 1 | 265 | 0.4% |
| graph validity | 1 | 265 | 0.4% |
| runtime completion | 0 | 265 | 0.0% |
| oracle match | 0 | 265 | 0.0% |

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 7 |
| parse_invalid | 257 |
| graph_invalid | 0 |
| execution_error | 1 |
| answer_mismatch | 0 |
| answer_match | 0 |

Per-item records: `items/holdout.jsonl`.
