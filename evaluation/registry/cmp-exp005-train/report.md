# Slice run — cmp-exp005-train

Artifact: `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-005-sft-widened/gguf/checkpoint-360.gguf`. Slice: comparison-slice (1000 items, training/data/comparison-slice.jsonl).

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 1000 | 1000 | 100.0% |
| graph validity | 1000 | 1000 | 100.0% |
| runtime completion | 989 | 1000 | 98.9% |
| oracle match | 957 | 1000 | 95.7% |

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 11 |
| answer_mismatch | 32 |
| answer_match | 957 |

Per-item records: `items/comparison-slice.jsonl`.
