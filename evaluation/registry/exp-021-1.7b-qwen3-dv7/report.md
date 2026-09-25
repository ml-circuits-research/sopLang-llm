# Evaluation report — exp-021-1.7b-qwen3-dv7 / holdout

| field | value |
| --- | --- |
| experiment | exp-021-1.7b-qwen3-dv7 |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 705 |
| checkpoint (GGUF) | evaluation/registry/exp-021-1.7b-qwen3-dv7/gguf/checkpoint-450.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | d4c741c3ccb4b0886a5053abddfd829a06f25951462e6185d9e8dcf152752609 |
| slice items sha256 | c5f946fcf65baa8b7ece6423f0e8f3b6eb902791a5f734a83bd745a65d32c572 |
| started at | 2026-09-25T16:05:38.547Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 705 | 705 | 100.0% |
| graph validity | 705 | 705 | 100.0% |
| runtime completion | 648 | 705 | 91.9% |
| oracle match | 460 | 705 | 65.2% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 57 |
| answer_mismatch | 188 |
| answer_match | 460 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 60.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 62.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 92.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 50.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 90.0% | 20.0% |
| procedural-arithmetic | 480 | 100.0% | 100.0% | 97.5% | 91.3% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 68.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 100.0% | 100.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 0d94641e8029 | 10 | 100.0% | 100.0% | 50.0% | 0.0% |
| 0ed1e095b244 | 40 | 100.0% | 100.0% | 75.0% | 0.0% |
| 22ac529460d7 | 100 | 100.0% | 100.0% | 92.0% | 0.0% |
| 25fc58208c35 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 34a16c5fdcc7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 465567a44bfc | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4e211b22a09f | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 57d67dab35e1 | 20 | 100.0% | 100.0% | 100.0% | 100.0% |
| 6ed8cfabafa7 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 73193d3fe3f5 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 7773917f1754 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 7ddd391272f8 | 10 | 100.0% | 100.0% | 60.0% | 0.0% |
| 949ce9735467 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9fcc306d70e6 | 40 | 100.0% | 100.0% | 95.0% | 95.0% |
| a4f8cfa680c0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| ad1fda5019a6 | 25 | 100.0% | 100.0% | 68.0% | 0.0% |
| cac251fdc36d | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| d6101183fce0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| daa7e4e63fae | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| fff4c171f24e | 50 | 100.0% | 100.0% | 62.0% | 0.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 4 | 6 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 19 | 31 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 8 | 92 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 5 | 5 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 1 | 7 | 2 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 12 | 30 | 438 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 8 | 17 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 0 | 0 | 20 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0d94641e8029 | 0 | 0 | 0 | 0 | 5 | 5 | 0 |
| 0ed1e095b244 | 0 | 0 | 0 | 0 | 10 | 30 | 0 |
| 22ac529460d7 | 0 | 0 | 0 | 0 | 8 | 92 | 0 |
| 25fc58208c35 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 34a16c5fdcc7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 465567a44bfc | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4e211b22a09f | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 57d67dab35e1 | 0 | 0 | 0 | 0 | 0 | 0 | 20 |
| 6ed8cfabafa7 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 73193d3fe3f5 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 7773917f1754 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 7ddd391272f8 | 0 | 0 | 0 | 0 | 4 | 6 | 0 |
| 949ce9735467 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9fcc306d70e6 | 0 | 0 | 0 | 0 | 2 | 0 | 38 |
| a4f8cfa680c0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| ad1fda5019a6 | 0 | 0 | 0 | 0 | 8 | 17 | 0 |
| cac251fdc36d | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| d6101183fce0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| daa7e4e63fae | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| fff4c171f24e | 0 | 0 | 0 | 0 | 19 | 31 | 0 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 161874 |
| prompt tokens | 200304 |
| calls | 705 |
| wall clock (s) | 3234.9 |
| generated tokens/s | 50.04 |
| generated tokens per correct answer | 351.9 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-021-1.7b-qwen3-dv7/gguf/checkpoint-450.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
