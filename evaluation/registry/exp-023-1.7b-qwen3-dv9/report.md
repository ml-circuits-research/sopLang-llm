# Evaluation report — exp-023-1.7b-qwen3-dv9 / holdout

| field | value |
| --- | --- |
| experiment | exp-023-1.7b-qwen3-dv9 |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 705 |
| checkpoint (GGUF) | evaluation/registry/exp-023-1.7b-qwen3-dv9/gguf/checkpoint-600.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | 6e5605dabfb574329072bae37c6cd0cb2e20a2fe3ebb77b144df82e7d165fa9d |
| slice items sha256 | 4f951215a072b856f65ec93128884d40a8c549c4a7d3903b02bc63bb075335c8 |
| started at | 2026-09-26T01:09:50.789Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 705 | 705 | 100.0% |
| graph validity | 705 | 705 | 100.0% |
| runtime completion | 613 | 705 | 87.0% |
| oracle match | 428 | 705 | 60.7% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 92 |
| answer_mismatch | 185 |
| answer_match | 428 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 80.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 38.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 64.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 90.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 90.0% | 20.0% |
| procedural-arithmetic | 480 | 100.0% | 100.0% | 97.1% | 85.4% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 72.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 100.0% | 80.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 0b89d6528ef3 | 100 | 100.0% | 100.0% | 64.0% | 0.0% |
| 0d94641e8029 | 10 | 100.0% | 100.0% | 90.0% | 0.0% |
| 0ed1e095b244 | 40 | 100.0% | 100.0% | 97.5% | 0.0% |
| 1b5ca46d840c | 20 | 100.0% | 100.0% | 100.0% | 80.0% |
| 25fc58208c35 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 34a16c5fdcc7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 3c75bad1e1af | 25 | 100.0% | 100.0% | 72.0% | 0.0% |
| 491760a256c7 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4b81eda2bd61 | 50 | 100.0% | 100.0% | 38.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4e211b22a09f | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 6ed8cfabafa7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 73193d3fe3f5 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 7773917f1754 | 40 | 100.0% | 100.0% | 70.0% | 70.0% |
| 91fb4677f6c8 | 10 | 100.0% | 100.0% | 80.0% | 0.0% |
| 9abffcf5f362 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9fcc306d70e6 | 40 | 100.0% | 100.0% | 97.5% | 55.0% |
| a4f8cfa680c0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| cac251fdc36d | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| d6101183fce0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| daa7e4e63fae | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 2 | 8 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 31 | 19 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 36 | 64 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 1 | 9 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 1 | 7 | 2 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 14 | 56 | 410 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 7 | 18 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 0 | 4 | 16 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0b89d6528ef3 | 0 | 0 | 0 | 0 | 36 | 64 | 0 |
| 0d94641e8029 | 0 | 0 | 0 | 0 | 1 | 9 | 0 |
| 0ed1e095b244 | 0 | 0 | 0 | 0 | 1 | 39 | 0 |
| 1b5ca46d840c | 0 | 0 | 0 | 0 | 0 | 4 | 16 |
| 25fc58208c35 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 34a16c5fdcc7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 3c75bad1e1af | 0 | 0 | 0 | 0 | 7 | 18 | 0 |
| 491760a256c7 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4b81eda2bd61 | 0 | 0 | 0 | 0 | 31 | 19 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4e211b22a09f | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 6ed8cfabafa7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 73193d3fe3f5 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 7773917f1754 | 0 | 0 | 0 | 0 | 12 | 0 | 28 |
| 91fb4677f6c8 | 0 | 0 | 0 | 0 | 2 | 8 | 0 |
| 9abffcf5f362 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9fcc306d70e6 | 0 | 0 | 0 | 0 | 1 | 17 | 22 |
| a4f8cfa680c0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| cac251fdc36d | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| d6101183fce0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| daa7e4e63fae | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 170257 |
| prompt tokens | 200304 |
| calls | 705 |
| wall clock (s) | 3272 |
| generated tokens/s | 52.03 |
| generated tokens per correct answer | 397.8 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-023-1.7b-qwen3-dv9/gguf/checkpoint-600.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
