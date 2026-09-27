# Evaluation report — exp-027-1.7b-qwen3-dv13 / holdout

| field | value |
| --- | --- |
| experiment | exp-027-1.7b-qwen3-dv13 |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 705 |
| checkpoint (GGUF) | evaluation/registry/exp-027-1.7b-qwen3-dv13/gguf/checkpoint-600.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | 897b8c4fb102ab3f1e7812a4fe92a9a37addb67a4b1aac73ed5500519d49cf04 |
| slice items sha256 | 568762bd50c2485d07f50b0b70aff4fc3f494edbd7d659da930f7f11f3322864 |
| started at | 2026-09-27T00:18:26.983Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 705 | 705 | 100.0% |
| graph validity | 705 | 705 | 100.0% |
| runtime completion | 521 | 705 | 73.9% |
| oracle match | 421 | 705 | 59.7% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 184 |
| answer_mismatch | 100 |
| answer_match | 421 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 40.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 0.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 6.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 90.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 80.0% | 20.0% |
| procedural-arithmetic | 480 | 100.0% | 100.0% | 95.8% | 86.3% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 56.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 100.0% | 25.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 0691316e8776 | 100 | 100.0% | 100.0% | 6.0% | 0.0% |
| 0d94641e8029 | 10 | 100.0% | 100.0% | 90.0% | 0.0% |
| 0ed1e095b244 | 40 | 100.0% | 100.0% | 92.5% | 0.0% |
| 25fc58208c35 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 308e22f9aa8a | 50 | 100.0% | 100.0% | 0.0% | 0.0% |
| 34a16c5fdcc7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 3c75bad1e1af | 25 | 100.0% | 100.0% | 56.0% | 0.0% |
| 40c7082092af | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| 4e211b22a09f | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 6ed8cfabafa7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 73193d3fe3f5 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 7773917f1754 | 40 | 100.0% | 100.0% | 60.0% | 60.0% |
| 7ddd391272f8 | 10 | 100.0% | 100.0% | 40.0% | 0.0% |
| 9abffcf5f362 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9fcc306d70e6 | 40 | 100.0% | 100.0% | 97.5% | 77.5% |
| a4f8cfa680c0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| b43e89c2d7a0 | 20 | 100.0% | 100.0% | 100.0% | 25.0% |
| cac251fdc36d | 40 | 100.0% | 100.0% | 100.0% | 97.5% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| d6101183fce0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| daa7e4e63fae | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 6 | 4 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 50 | 0 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 94 | 6 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 1 | 9 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 2 | 6 | 2 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 20 | 46 | 414 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 11 | 14 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 0 | 15 | 5 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0691316e8776 | 0 | 0 | 0 | 0 | 94 | 6 | 0 |
| 0d94641e8029 | 0 | 0 | 0 | 0 | 1 | 9 | 0 |
| 0ed1e095b244 | 0 | 0 | 0 | 0 | 3 | 37 | 0 |
| 25fc58208c35 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 308e22f9aa8a | 0 | 0 | 0 | 0 | 50 | 0 | 0 |
| 34a16c5fdcc7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 3c75bad1e1af | 0 | 0 | 0 | 0 | 11 | 14 | 0 |
| 40c7082092af | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 4e211b22a09f | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 6ed8cfabafa7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 73193d3fe3f5 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 7773917f1754 | 0 | 0 | 0 | 0 | 16 | 0 | 24 |
| 7ddd391272f8 | 0 | 0 | 0 | 0 | 6 | 4 | 0 |
| 9abffcf5f362 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9fcc306d70e6 | 0 | 0 | 0 | 0 | 1 | 8 | 31 |
| a4f8cfa680c0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| b43e89c2d7a0 | 0 | 0 | 0 | 0 | 0 | 15 | 5 |
| cac251fdc36d | 0 | 0 | 0 | 0 | 0 | 1 | 39 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| d6101183fce0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| daa7e4e63fae | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 209099 |
| prompt tokens | 197704 |
| calls | 705 |
| wall clock (s) | 3976.2 |
| generated tokens/s | 52.59 |
| generated tokens per correct answer | 496.67 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-027-1.7b-qwen3-dv13/gguf/checkpoint-600.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
