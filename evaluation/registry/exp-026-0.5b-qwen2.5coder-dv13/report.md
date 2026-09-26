# Evaluation report — exp-026-0.5b-qwen2.5coder-dv13 / holdout

| field | value |
| --- | --- |
| experiment | exp-026-0.5b-qwen2.5coder-dv13 |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 705 |
| checkpoint (GGUF) | evaluation/registry/exp-026-0.5b-qwen2.5coder-dv13/gguf/checkpoint-660.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | 897b8c4fb102ab3f1e7812a4fe92a9a37addb67a4b1aac73ed5500519d49cf04 |
| slice items sha256 | 568762bd50c2485d07f50b0b70aff4fc3f494edbd7d659da930f7f11f3322864 |
| started at | 2026-09-26T20:14:30.760Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 705 | 705 | 100.0% |
| graph validity | 705 | 705 | 100.0% |
| runtime completion | 491 | 705 | 69.6% |
| oracle match | 361 | 705 | 51.2% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 214 |
| answer_mismatch | 130 |
| answer_match | 361 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 40.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 0.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 45.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 80.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 60.0% | 10.0% |
| procedural-arithmetic | 480 | 100.0% | 100.0% | 84.6% | 75.0% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 88.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 0.0% | 0.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 0691316e8776 | 100 | 100.0% | 100.0% | 45.0% | 0.0% |
| 0d94641e8029 | 10 | 100.0% | 100.0% | 80.0% | 0.0% |
| 0ed1e095b244 | 40 | 100.0% | 100.0% | 95.0% | 0.0% |
| 25fc58208c35 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 308e22f9aa8a | 50 | 100.0% | 100.0% | 0.0% | 0.0% |
| 34a16c5fdcc7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 3c75bad1e1af | 25 | 100.0% | 100.0% | 88.0% | 0.0% |
| 40c7082092af | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| 4e211b22a09f | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 6ed8cfabafa7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 73193d3fe3f5 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 7773917f1754 | 40 | 100.0% | 100.0% | 0.0% | 0.0% |
| 7ddd391272f8 | 10 | 100.0% | 100.0% | 40.0% | 0.0% |
| 9abffcf5f362 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9fcc306d70e6 | 40 | 100.0% | 100.0% | 20.0% | 0.0% |
| a4f8cfa680c0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| b43e89c2d7a0 | 20 | 100.0% | 100.0% | 0.0% | 0.0% |
| cac251fdc36d | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| d6101183fce0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| daa7e4e63fae | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 6 | 4 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 50 | 0 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 55 | 45 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 2 | 8 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 4 | 5 | 1 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 74 | 46 | 360 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 3 | 22 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 20 | 0 | 0 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0691316e8776 | 0 | 0 | 0 | 0 | 55 | 45 | 0 |
| 0d94641e8029 | 0 | 0 | 0 | 0 | 2 | 8 | 0 |
| 0ed1e095b244 | 0 | 0 | 0 | 0 | 2 | 38 | 0 |
| 25fc58208c35 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 308e22f9aa8a | 0 | 0 | 0 | 0 | 50 | 0 | 0 |
| 34a16c5fdcc7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 3c75bad1e1af | 0 | 0 | 0 | 0 | 3 | 22 | 0 |
| 40c7082092af | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 4e211b22a09f | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 6ed8cfabafa7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 73193d3fe3f5 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 7773917f1754 | 0 | 0 | 0 | 0 | 40 | 0 | 0 |
| 7ddd391272f8 | 0 | 0 | 0 | 0 | 6 | 4 | 0 |
| 9abffcf5f362 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9fcc306d70e6 | 0 | 0 | 0 | 0 | 32 | 8 | 0 |
| a4f8cfa680c0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| b43e89c2d7a0 | 0 | 0 | 0 | 0 | 20 | 0 | 0 |
| cac251fdc36d | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| d6101183fce0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| daa7e4e63fae | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 170431 |
| prompt tokens | 197704 |
| calls | 705 |
| wall clock (s) | 1401.5 |
| generated tokens/s | 121.6 |
| generated tokens per correct answer | 472.11 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-026-0.5b-qwen2.5coder-dv13/gguf/checkpoint-660.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
