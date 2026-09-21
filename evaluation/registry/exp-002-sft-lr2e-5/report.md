# Evaluation report — exp-002-sft-lr2e-5 / holdout

| field | value |
| --- | --- |
| experiment | exp-002-sft-lr2e-5 |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 225 |
| checkpoint (GGUF) | evaluation/registry/exp-002-sft-lr2e-5/gguf/checkpoint-450.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-1 |
| system prompt sha256 | 67655b81e61a7025442d5d9db6f47566350b4f3d045d48083089ff05608caae2 |
| dataset snapshot | 82d3dedb8f4c296f09969ca154ae62d9139c01215cea1cf51a86680132bf3289 |
| started at | 2026-09-18T21:38:29.869Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 225 | 225 | 100.0% |
| graph validity | 224 | 225 | 99.6% |
| runtime completion | 28 | 225 | 12.4% |
| oracle match | 0 | 225 | 0.0% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 1 |
| execution_error | 196 |
| answer_mismatch | 28 |
| answer_match | 0 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 20.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 6.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 10.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 70.0% | 0.0% |
| scientific-reasoning | 25 | 100.0% | 96.0% | 0.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 20.0% | 0.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 40 | 10 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 94 | 6 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 9 | 1 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 3 | 7 | 0 |
| scientific-reasoning | 0 | 0 | 0 | 1 | 24 | 0 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 16 | 4 | 0 |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 465567a44bfc | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 949ce9735467 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| b6067c846929 | 50 | 100.0% | 100.0% | 20.0% | 0.0% |
| c40e0cf7b406 | 100 | 100.0% | 100.0% | 6.0% | 0.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| d02e23018985 | 25 | 100.0% | 96.0% | 0.0% | 0.0% |
| d7443e28a4d0 | 10 | 100.0% | 100.0% | 10.0% | 0.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| e4162dccf502 | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f24876b91e96 | 20 | 100.0% | 100.0% | 20.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 156553 |
| prompt tokens | 49948 |
| neural calls (generation attempts) | 225 |
| wall clock (summed per-item generation latency) | 1301.4 s |
| generated tokens per second | 120.29 |
| cost per correct (generated tokens per answer_match) | n/a (no correct answer) |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-002-sft-lr2e-5/gguf/checkpoint-450.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
