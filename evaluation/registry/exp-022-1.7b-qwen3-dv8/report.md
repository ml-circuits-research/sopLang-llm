# Evaluation report — exp-022-1.7b-qwen3-dv8 / holdout

| field | value |
| --- | --- |
| experiment | exp-022-1.7b-qwen3-dv8 |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 705 |
| checkpoint (GGUF) | evaluation/registry/exp-022-1.7b-qwen3-dv8/gguf/checkpoint-450.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | 6cdb6e6ec3582242812a5a985c243b2651f23499a862f511cd1b830e522b40d4 |
| slice items sha256 | 3d5269c7d05f895a358fcd737247eef9985925a6c37dd30fcfad1848f6ff63a5 |
| started at | 2026-09-25T20:56:27.395Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 705 | 705 | 100.0% |
| graph validity | 705 | 705 | 100.0% |
| runtime completion | 570 | 705 | 80.9% |
| oracle match | 448 | 705 | 63.5% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 135 |
| answer_mismatch | 122 |
| answer_match | 448 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 48.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 41.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 90.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 70.0% | 0.0% |
| procedural-arithmetic | 480 | 100.0% | 100.0% | 93.5% | 89.2% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 80.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 100.0% | 100.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 0898e06f4695 | 50 | 100.0% | 100.0% | 48.0% | 0.0% |
| 0d94641e8029 | 10 | 100.0% | 100.0% | 90.0% | 0.0% |
| 0ed1e095b244 | 40 | 100.0% | 100.0% | 52.5% | 0.0% |
| 1b5ca46d840c | 20 | 100.0% | 100.0% | 100.0% | 100.0% |
| 22ac529460d7 | 100 | 100.0% | 100.0% | 41.0% | 0.0% |
| 25fc58208c35 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 34a16c5fdcc7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 3c75bad1e1af | 25 | 100.0% | 100.0% | 80.0% | 0.0% |
| 491760a256c7 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4e211b22a09f | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 6ed8cfabafa7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 73193d3fe3f5 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 7773917f1754 | 40 | 100.0% | 100.0% | 80.0% | 80.0% |
| 91fb4677f6c8 | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| 9abffcf5f362 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9fcc306d70e6 | 40 | 100.0% | 100.0% | 90.0% | 90.0% |
| a4f8cfa680c0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| cac251fdc36d | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| d6101183fce0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| daa7e4e63fae | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 26 | 24 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 59 | 41 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 1 | 9 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 3 | 7 | 0 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 31 | 21 | 428 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 5 | 20 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 0 | 0 | 20 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0898e06f4695 | 0 | 0 | 0 | 0 | 26 | 24 | 0 |
| 0d94641e8029 | 0 | 0 | 0 | 0 | 1 | 9 | 0 |
| 0ed1e095b244 | 0 | 0 | 0 | 0 | 19 | 21 | 0 |
| 1b5ca46d840c | 0 | 0 | 0 | 0 | 0 | 0 | 20 |
| 22ac529460d7 | 0 | 0 | 0 | 0 | 59 | 41 | 0 |
| 25fc58208c35 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 34a16c5fdcc7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 3c75bad1e1af | 0 | 0 | 0 | 0 | 5 | 20 | 0 |
| 491760a256c7 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4e211b22a09f | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 6ed8cfabafa7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 73193d3fe3f5 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 7773917f1754 | 0 | 0 | 0 | 0 | 8 | 0 | 32 |
| 91fb4677f6c8 | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| 9abffcf5f362 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9fcc306d70e6 | 0 | 0 | 0 | 0 | 4 | 0 | 36 |
| a4f8cfa680c0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| cac251fdc36d | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| d6101183fce0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| daa7e4e63fae | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 160741 |
| prompt tokens | 200304 |
| calls | 705 |
| wall clock (s) | 3102.7 |
| generated tokens/s | 51.81 |
| generated tokens per correct answer | 358.8 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-022-1.7b-qwen3-dv8/gguf/checkpoint-450.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
