# Evaluation report — exp-014-deep-chains / holdout

| field | value |
| --- | --- |
| experiment | exp-014-deep-chains |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 705 |
| checkpoint (GGUF) | evaluation/registry/exp-014-deep-chains/gguf/checkpoint-450.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | 57daa1d42132f5f7f2abb9c1d2fe667512dd38983d467f0658e80f5cba405d99 |
| slice items sha256 | 3983739a47e8b2d1065219d72c3dc13ab34b5281636773bad5dcb5c72c0f8fee |
| started at | 2026-09-23T18:12:50.257Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 705 | 705 | 100.0% |
| graph validity | 705 | 705 | 100.0% |
| runtime completion | 504 | 705 | 71.5% |
| oracle match | 379 | 705 | 53.8% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 201 |
| answer_mismatch | 125 |
| answer_match | 379 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 100.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 2.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 40.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 70.0% | 20.0% |
| procedural-arithmetic | 480 | 100.0% | 100.0% | 86.9% | 78.5% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 80.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 20.0% | 0.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 007da36e0d00 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 0fcbffadde0b | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 161ba68cb1aa | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2c0b8f8615c5 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 2f7a9f0cbaed | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 465567a44bfc | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 6e8ad5b1f1a4 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 949ce9735467 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| a63d4cb31bb4 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| b6067c846929 | 50 | 100.0% | 100.0% | 100.0% | 0.0% |
| bb7868b44786 | 40 | 100.0% | 100.0% | 92.5% | 0.0% |
| c34189ee5c69 | 40 | 100.0% | 100.0% | 50.0% | 42.5% |
| c40e0cf7b406 | 100 | 100.0% | 100.0% | 2.0% | 0.0% |
| c5fcc4056d56 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| d02e23018985 | 25 | 100.0% | 100.0% | 80.0% | 0.0% |
| d274ce491444 | 40 | 100.0% | 100.0% | 0.0% | 0.0% |
| d7443e28a4d0 | 10 | 100.0% | 100.0% | 40.0% | 0.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| e4162dccf502 | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f24876b91e96 | 20 | 100.0% | 100.0% | 20.0% | 0.0% |
| f3d031239b6c | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 0 | 50 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 98 | 2 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 6 | 4 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 3 | 5 | 2 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 63 | 40 | 377 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 5 | 20 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 16 | 4 | 0 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 007da36e0d00 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 0fcbffadde0b | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 161ba68cb1aa | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2c0b8f8615c5 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 2f7a9f0cbaed | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 465567a44bfc | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 6e8ad5b1f1a4 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 949ce9735467 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| a63d4cb31bb4 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| b6067c846929 | 0 | 0 | 0 | 0 | 0 | 50 | 0 |
| bb7868b44786 | 0 | 0 | 0 | 0 | 3 | 37 | 0 |
| c34189ee5c69 | 0 | 0 | 0 | 0 | 20 | 3 | 17 |
| c40e0cf7b406 | 0 | 0 | 0 | 0 | 98 | 2 | 0 |
| c5fcc4056d56 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| d02e23018985 | 0 | 0 | 0 | 0 | 5 | 20 | 0 |
| d274ce491444 | 0 | 0 | 0 | 0 | 40 | 0 | 0 |
| d7443e28a4d0 | 0 | 0 | 0 | 0 | 6 | 4 | 0 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| e4162dccf502 | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| f24876b91e96 | 0 | 0 | 0 | 0 | 16 | 4 | 0 |
| f3d031239b6c | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 235366 |
| prompt tokens | 200304 |
| calls | 705 |
| wall clock (s) | 4235.6 |
| generated tokens/s | 55.57 |
| generated tokens per correct answer | 621.02 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-014-deep-chains/gguf/checkpoint-450.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
