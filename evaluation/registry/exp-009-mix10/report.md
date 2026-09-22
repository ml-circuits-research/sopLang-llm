# Evaluation report — exp-009-mix10 / holdout

| field | value |
| --- | --- |
| experiment | exp-009-mix10 |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 265 |
| checkpoint (GGUF) | evaluation/registry/exp-009-mix10/gguf/checkpoint-728.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-2 |
| system prompt sha256 | dfe015ee9f325f0f859383073b93ddda440d00d64ab0b0e9e7de7c1c1cef3a03 |
| dataset snapshot (trainer export at scoring time) | 5ffd341ef13dcda876fe51c15569553dc7af9f4cd0adf6773fcdf7dc64842e12 |
| slice items sha256 | 5f044d35b30e30f234710b2ca5bb18ed21116c32cdaacea316090019d301418a |
| started at | 2026-09-22T07:13:03.819Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 265 | 265 | 100.0% |
| graph validity | 265 | 265 | 100.0% |
| runtime completion | 51 | 265 | 19.2% |
| oracle match | 0 | 265 | 0.0% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 214 |
| answer_mismatch | 51 |
| answer_match | 0 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 0.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 5.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 20.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 70.0% | 0.0% |
| procedural-arithmetic | 40 | 100.0% | 100.0% | 60.0% | 0.0% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 52.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 0.0% | 0.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 465567a44bfc | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 949ce9735467 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| b6067c846929 | 50 | 100.0% | 100.0% | 0.0% | 0.0% |
| bb7868b44786 | 40 | 100.0% | 100.0% | 60.0% | 0.0% |
| c40e0cf7b406 | 100 | 100.0% | 100.0% | 5.0% | 0.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| d02e23018985 | 25 | 100.0% | 100.0% | 52.0% | 0.0% |
| d7443e28a4d0 | 10 | 100.0% | 100.0% | 20.0% | 0.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| e4162dccf502 | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f24876b91e96 | 20 | 100.0% | 100.0% | 0.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 50 | 0 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 95 | 5 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 8 | 2 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 3 | 7 | 0 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 16 | 24 | 0 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 12 | 13 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 20 | 0 | 0 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 465567a44bfc | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 949ce9735467 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| b6067c846929 | 0 | 0 | 0 | 0 | 50 | 0 | 0 |
| bb7868b44786 | 0 | 0 | 0 | 0 | 16 | 24 | 0 |
| c40e0cf7b406 | 0 | 0 | 0 | 0 | 95 | 5 | 0 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| d02e23018985 | 0 | 0 | 0 | 0 | 12 | 13 | 0 |
| d7443e28a4d0 | 0 | 0 | 0 | 0 | 8 | 2 | 0 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| e4162dccf502 | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| f24876b91e96 | 0 | 0 | 0 | 0 | 20 | 0 | 0 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 151515 |
| prompt tokens | 68360 |
| calls | 265 |
| wall clock (s) | 1297 |
| generated tokens/s | 116.82 |
| generated tokens per correct answer | n/a |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-009-mix10/gguf/checkpoint-728.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
