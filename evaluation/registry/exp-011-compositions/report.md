# Evaluation report — exp-011-compositions / holdout

| field | value |
| --- | --- |
| experiment | exp-011-compositions |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 425 |
| checkpoint (GGUF) | evaluation/registry/exp-011-compositions/gguf/checkpoint-630.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | a4b1a534db1049828654782722696e32d0b90d436df7bb3d17bd6e4bb58ebc37 |
| slice items sha256 | 87c926bd1387cd84dd81bb9eb860b1fcc35a1a2c35b2188b23841da103e9a9cb |
| started at | 2026-09-22T20:33:12.501Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 425 | 425 | 100.0% |
| graph validity | 425 | 425 | 100.0% |
| runtime completion | 215 | 425 | 50.6% |
| oracle match | 161 | 425 | 37.9% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 210 |
| answer_mismatch | 54 |
| answer_match | 161 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 4.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 16.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 30.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 50.0% | 10.0% |
| procedural-arithmetic | 200 | 100.0% | 100.0% | 94.5% | 80.0% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 0.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 0.0% | 0.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 2f5feec45f96 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 465567a44bfc | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 100.0% | 100.0% |
| 6badfbe67551 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 949ce9735467 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| a2cc6df855e0 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| b6067c846929 | 50 | 100.0% | 100.0% | 4.0% | 0.0% |
| bb7868b44786 | 40 | 100.0% | 100.0% | 72.5% | 0.0% |
| bde96495399a | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| c40e0cf7b406 | 100 | 100.0% | 100.0% | 16.0% | 0.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| d02e23018985 | 25 | 100.0% | 100.0% | 0.0% | 0.0% |
| d7443e28a4d0 | 10 | 100.0% | 100.0% | 30.0% | 0.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| e4162dccf502 | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| f24876b91e96 | 20 | 100.0% | 100.0% | 0.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 48 | 2 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 84 | 16 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 7 | 3 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 5 | 4 | 1 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 11 | 29 | 160 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 25 | 0 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 20 | 0 | 0 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 2f5feec45f96 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 465567a44bfc | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 6badfbe67551 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 949ce9735467 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| a2cc6df855e0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| b6067c846929 | 0 | 0 | 0 | 0 | 48 | 2 | 0 |
| bb7868b44786 | 0 | 0 | 0 | 0 | 11 | 29 | 0 |
| bde96495399a | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| c40e0cf7b406 | 0 | 0 | 0 | 0 | 84 | 16 | 0 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| d02e23018985 | 0 | 0 | 0 | 0 | 25 | 0 | 0 |
| d7443e28a4d0 | 0 | 0 | 0 | 0 | 7 | 3 | 0 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| e4162dccf502 | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| f24876b91e96 | 0 | 0 | 0 | 0 | 20 | 0 | 0 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 166906 |
| prompt tokens | 124945 |
| calls | 425 |
| wall clock (s) | 1438.3 |
| generated tokens/s | 116.04 |
| generated tokens per correct answer | 1036.68 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-011-compositions/gguf/checkpoint-630.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
