# Evaluation report — exp-003-sft-lr1e-4 / holdout

| field | value |
| --- | --- |
| experiment | exp-003-sft-lr1e-4 |
| slice | holdout (/home/salboaie/work/sopLang-llm/training-data/<book>/eval/**/solution.sop) |
| items | 225 |
| checkpoint (GGUF) | evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540.gguf |
| model | not recorded |
| base url | http://127.0.0.1:8080 |
| chat profile | compiled-plan-chat-1 |
| system prompt sha256 | 67655b81e61a7025442d5d9db6f47566350b4f3d045d48083089ff05608caae2 |
| dataset snapshot | 82d3dedb8f4c296f09969ca154ae62d9139c01215cea1cf51a86680132bf3289 |
| started at | 2026-09-18T20:38:23.467Z |
| decoding | temperature 0, max_tokens 2048, concurrency 4; one generation attempt per item plus the client's single transport retry |

## Overall rates

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| parse validity | 225 | 225 | 100.0% |
| graph validity | 225 | 225 | 100.0% |
| runtime completion | 62 | 225 | 27.6% |
| oracle match | 0 | 225 | 0.0% |

## Outcome classes

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 0 |
| parse_invalid | 0 |
| graph_invalid | 0 |
| execution_error | 163 |
| answer_mismatch | 62 |
| answer_match | 0 |

## Rates by book

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| common-sense | 50 | 100.0% | 100.0% | 100.0% | 0.0% |
| decompose-to-solve | 100 | 100.0% | 100.0% | 1.0% | 0.0% |
| logical-reasoning | 10 | 100.0% | 100.0% | 30.0% | 0.0% |
| mathematical-thinking | 10 | 100.0% | 100.0% | 40.0% | 0.0% |
| scientific-reasoning | 25 | 100.0% | 100.0% | 16.0% | 0.0% |
| world-as-a-system | 20 | 100.0% | 100.0% | 0.0% | 0.0% |

## Classes by book

| key | generation_transport_error | wrapper_rejected | parse_invalid | graph_invalid | execution_error | answer_mismatch | answer_match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| common-sense | 0 | 0 | 0 | 0 | 0 | 50 | 0 |
| decompose-to-solve | 0 | 0 | 0 | 0 | 99 | 1 | 0 |
| logical-reasoning | 0 | 0 | 0 | 0 | 7 | 3 | 0 |
| mathematical-thinking | 0 | 0 | 0 | 0 | 6 | 4 | 0 |
| scientific-reasoning | 0 | 0 | 0 | 0 | 21 | 4 | 0 |
| world-as-a-system | 0 | 0 | 0 | 0 | 20 | 0 | 0 |

## Rates by plan cluster

| key | items | parse validity | graph validity | runtime completion | oracle match |
| --- | --- | --- | --- | --- | --- |
| 2f1f09a7ecc9 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 465567a44bfc | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| 4c5c90587868 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 949ce9735467 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| 9cf19a47caf8 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| b6067c846929 | 50 | 100.0% | 100.0% | 100.0% | 0.0% |
| c40e0cf7b406 | 100 | 100.0% | 100.0% | 1.0% | 0.0% |
| ce3d2c7f3848 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| d02e23018985 | 25 | 100.0% | 100.0% | 16.0% | 0.0% |
| d7443e28a4d0 | 10 | 100.0% | 100.0% | 30.0% | 0.0% |
| d7bf7b42f6e3 | 1 | 100.0% | 100.0% | 0.0% | 0.0% |
| df7d891093d1 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| e4162dccf502 | 10 | 100.0% | 100.0% | 0.0% | 0.0% |
| e576d1c206a0 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |
| f24876b91e96 | 20 | 100.0% | 100.0% | 0.0% | 0.0% |
| f55973c01b53 | 1 | 100.0% | 100.0% | 100.0% | 0.0% |

## Efficiency

| metric | value |
| --- | --- |
| generated tokens | 131699 |
| prompt tokens | 49948 |
| neural calls (generation attempts) | 225 |
| wall clock (summed per-item generation latency) | 1049.7 s |
| generated tokens per second | 125.46 |
| cost per correct (generated tokens per answer_match) | n/a (no correct answer) |

## Artifact consistency

No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540.gguf, model not recorded), the same run manifest (`run-manifest.json`), and the same per-item records (`items/holdout.jsonl`).
