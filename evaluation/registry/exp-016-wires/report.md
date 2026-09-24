# Evaluation report — exp-016-wires / holdout

| field | value |
| --- | --- |
| experiment | exp-016-wires |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 705 |
| checkpoint (GGUF) | evaluation/registry/exp-016-wires/gguf/checkpoint-600.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-4 |
| system prompt sha256 | c2967d80d31eeb8a8f1605e75ece90edd16a0f0338a7b24bf15442bbf9287a74 |
| dataset snapshot (trainer export at scoring time) | b423751423877019cfd23d13aedc435cffeb5991e758b53131acb25124236e40 |
| slice items sha256 | 5e1f071929d442da5bbe36ced7e0136b8854ceec098f1b6cafcf91fa0b749f3f |
| started at | 2026-09-24T09:29:12.891Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 705 | 705 | 100.0% |
| graph validity | 705 | 705 | 100.0% |
| runtime completion | 530 | 705 | 75.2% |
| oracle match | 440 | 705 | 62.4% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 175 |
| answer_mismatch | 90 |
| answer_match | 440 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 10.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 70.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 2.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 50.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 50.0% | 0.0% |
| procedural-arithmetic | 480 | 100.0% | 100.0% | 97.3% | 91.7% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 40.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 25.0% | 0.0% |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 007da36e0d00 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 0fcbffadde0b | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 161ba68cb1aa | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2c0b8f8615c5 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 2f7a9f0cbaed | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 465567a44bfc | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 6e8ad5b1f1a4 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 8bbf314b424d | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| 949ce9735467 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| b6067c846929 | 50 | 100.0% | 100.0% | 70.0% | 0.0% |
| bb7868b44786 | 40 | 100.0% | 100.0% | 67.5% | 0.0% |
| c34189ee5c69 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| c40e0cf7b406 | 100 | 100.0% | 100.0% | 2.0% | 0.0% |
| c5fcc4056d56 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| d02e23018985 | 25 | 100.0% | 100.0% | 40.0% | 0.0% |
| d274ce491444 | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| d7443e28a4d0 | 10 | 100.0% | 100.0% | 50.0% | 0.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| e4162dccf502 | 10 | 100.0% | 100.0% | 10.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f24876b91e96 | 20 | 100.0% | 100.0% | 25.0% | 0.0% |
| f3d031239b6c | 40 | 100.0% | 100.0% | 100.0% | 100.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 9 | 1 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 15 | 35 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 98 | 2 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 5 | 5 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 5 | 5 | 0 |
| procedural-arithmetic | 0 | 0 | 0 | 0 | 13 | 27 | 440 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 15 | 10 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 15 | 5 | 0 |

## Classes by plan cluster

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 007da36e0d00 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 0fcbffadde0b | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 161ba68cb1aa | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2c0b8f8615c5 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 2f1f09a7ecc9 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 2f7a9f0cbaed | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 465567a44bfc | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 4c5c90587868 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 6e8ad5b1f1a4 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 8bbf314b424d | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| 949ce9735467 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 9cf19a47caf8 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| b6067c846929 | 0 | 0 | 0 | 0 | 15 | 35 | 0 |
| bb7868b44786 | 0 | 0 | 0 | 0 | 13 | 27 | 0 |
| c34189ee5c69 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| c40e0cf7b406 | 0 | 0 | 0 | 0 | 98 | 2 | 0 |
| c5fcc4056d56 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| ce3d2c7f3848 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| d02e23018985 | 0 | 0 | 0 | 0 | 15 | 10 | 0 |
| d274ce491444 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| d7443e28a4d0 | 0 | 0 | 0 | 0 | 5 | 5 | 0 |
| d7bf7b42f6e3 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| df7d891093d1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| e4162dccf502 | 0 | 0 | 0 | 0 | 9 | 1 | 0 |
| e576d1c206a0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| f24876b91e96 | 0 | 0 | 0 | 0 | 15 | 5 | 0 |
| f3d031239b6c | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| f55973c01b53 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 226313 |
| prompt tokens | 200304 |
| calls | 705 |
| wall clock (s) | 4228 |
| generated tokens/s | 53.53 |
| generated tokens per correct answer | 514.35 |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-016-wires/gguf/checkpoint-600.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
