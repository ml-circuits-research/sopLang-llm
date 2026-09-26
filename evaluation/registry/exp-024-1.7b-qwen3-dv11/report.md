# Evaluation report — exp-024-1.7b-qwen3-dv11 / holdout

| field | value |
| --- | --- |
| experiment | exp-024-1.7b-qwen3-dv11 |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 705 |
| checkpoint (GGUF) | evaluation/registry/exp-024-1.7b-qwen3-dv11/gguf/checkpoint-600.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | 29b8675c2e163371cc0e5931bf3e75ede264531f4e1807d986b303163d90b511 |
| slice items sha256 | 6fe68cf757ed41b9ae38f1736eb0c178d0e06f7dff6667b7e3e5e1a7c026f8cc |
| started at | 2026-09-26T12:40:53.498Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 705 | 705 | 100.0% |
| graph validity | 705 | 705 | 100.0% |
| runtime completion | 593 | 705 | 84.1% |
| oracle match | 439 | 705 | 62.3% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 112 |
| answer_mismatch | 154 |
| answer_match | 439 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 20.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 88.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 38.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 100.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 100.0% | 30.0% |
| procedural-arithmetic | 480 | 100.0% | 100.0% | 94.8% | 86.7% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 56.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 100.0% | 100.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 0691316e8776 | 100 | 100.0% | 100.0% | 38.0% | 0.0% |
| 0898e06f4695 | 50 | 100.0% | 100.0% | 88.0% | 0.0% |
| 0d94641e8029 | 10 | 100.0% | 100.0% | 100.0% | 0.0% |
| 0ed1e095b244 | 40 | 100.0% | 100.0% | 97.5% | 0.0% |
| 25fc58208c35 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 34a16c5fdcc7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 3c75bad1e1af | 25 | 100.0% | 100.0% | 56.0% | 0.0% |
| 40c7082092af | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| 4e211b22a09f | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 6ed8cfabafa7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 73193d3fe3f5 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 7773917f1754 | 40 | 100.0% | 100.0% | 52.5% | 52.5% |
| 7ddd391272f8 | 10 | 100.0% | 100.0% | 20.0% | 0.0% |
| 9abffcf5f362 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9fcc306d70e6 | 40 | 100.0% | 100.0% | 87.5% | 87.5% |
| a4f8cfa680c0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| b43e89c2d7a0 | 20 | 100.0% | 100.0% | 100.0% | 100.0% |
| cac251fdc36d | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| d6101183fce0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| daa7e4e63fae | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 8 | 2 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 6 | 44 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 62 | 38 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 0 | 10 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 0 | 7 | 3 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 25 | 39 | 416 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 11 | 14 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 0 | 0 | 20 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0691316e8776 | 0 | 0 | 0 | 0 | 62 | 38 | 0 |
| 0898e06f4695 | 0 | 0 | 0 | 0 | 6 | 44 | 0 |
| 0d94641e8029 | 0 | 0 | 0 | 0 | 0 | 10 | 0 |
| 0ed1e095b244 | 0 | 0 | 0 | 0 | 1 | 39 | 0 |
| 25fc58208c35 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 34a16c5fdcc7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 3c75bad1e1af | 0 | 0 | 0 | 0 | 11 | 14 | 0 |
| 40c7082092af | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 4e211b22a09f | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 6ed8cfabafa7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 73193d3fe3f5 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 7773917f1754 | 0 | 0 | 0 | 0 | 19 | 0 | 21 |
| 7ddd391272f8 | 0 | 0 | 0 | 0 | 8 | 2 | 0 |
| 9abffcf5f362 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9fcc306d70e6 | 0 | 0 | 0 | 0 | 5 | 0 | 35 |
| a4f8cfa680c0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| b43e89c2d7a0 | 0 | 0 | 0 | 0 | 0 | 0 | 20 |
| cac251fdc36d | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| d6101183fce0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| daa7e4e63fae | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 169609 |
| prompt tokens | 200304 |
| calls | 705 |
| wall clock (s) | 3257.9 |
| generated tokens/s | 52.06 |
| generated tokens per correct answer | 386.35 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-024-1.7b-qwen3-dv11/gguf/checkpoint-600.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
