# Evaluation report — exp-013-1.5b / holdout

| field | value |
| --- | --- |
| experiment | exp-013-1.5b |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 585 |
| checkpoint (GGUF) | evaluation/registry/exp-013-1.5b/gguf/checkpoint-450.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | cc1929f3d7c3da19f17bf254758c8d9e52c42324e35f01b13bff16c7bf423f00 |
| slice items sha256 | 90adfe367b7d9ad948328a65a5d6ca8f75b8cddea3b43d34a9e2eb4b43d2172a |
| started at | 2026-09-23T10:38:16.101Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 585 | 585 | 100.0% |
| graph validity | 585 | 585 | 100.0% |
| runtime completion | 423 | 585 | 72.3% |
| oracle match | 322 | 585 | 55.0% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 162 |
| answer_mismatch | 101 |
| answer_match | 322 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 20.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 17.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 80.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 90.0% | 20.0% |
| procedural-arithmetic | 360 | 100.0% | 100.0% | 97.8% | 88.9% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 28.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 100.0% | 0.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 465567a44bfc | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 59ae83ed8f1b | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 742f4befe42a | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 80e6ffd5acb2 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 917d453f9f96 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 949ce9735467 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| b6067c846929 | 50 | 100.0% | 100.0% | 20.0% | 0.0% |
| bb7868b44786 | 40 | 100.0% | 100.0% | 80.0% | 0.0% |
| c1357a067190 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| c40e0cf7b406 | 100 | 100.0% | 100.0% | 17.0% | 0.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| d02e23018985 | 25 | 100.0% | 100.0% | 28.0% | 0.0% |
| d7443e28a4d0 | 10 | 100.0% | 100.0% | 80.0% | 0.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| d9ea7cafc934 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| e4162dccf502 | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| e9b381b3d402 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| f234fa9d0d5f | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| f24876b91e96 | 20 | 100.0% | 100.0% | 100.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 40 | 10 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 83 | 17 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 2 | 8 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 1 | 7 | 2 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 8 | 32 | 320 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 18 | 7 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 0 | 20 | 0 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 465567a44bfc | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 59ae83ed8f1b | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 742f4befe42a | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 80e6ffd5acb2 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 917d453f9f96 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 949ce9735467 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| b6067c846929 | 0 | 0 | 0 | 0 | 40 | 10 | 0 |
| bb7868b44786 | 0 | 0 | 0 | 0 | 8 | 32 | 0 |
| c1357a067190 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| c40e0cf7b406 | 0 | 0 | 0 | 0 | 83 | 17 | 0 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| d02e23018985 | 0 | 0 | 0 | 0 | 18 | 7 | 0 |
| d7443e28a4d0 | 0 | 0 | 0 | 0 | 2 | 8 | 0 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| d9ea7cafc934 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| e4162dccf502 | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| e9b381b3d402 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| f234fa9d0d5f | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| f24876b91e96 | 0 | 0 | 0 | 0 | 0 | 20 | 0 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 202499 |
| prompt tokens | 167402 |
| calls | 585 |
| wall clock (s) | 4396.1 |
| generated tokens/s | 46.06 |
| generated tokens per correct answer | 628.88 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-013-1.5b/gguf/checkpoint-450.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
