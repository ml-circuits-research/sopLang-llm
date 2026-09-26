# Semantic re-evaluation of the benchmark (2026-09-26)

The benchmark's answer comparison was exact-phrase based. A sanity experiment showed that a
competent writer computes ~18/20 items correctly but scores 2/20 because the recorded answers
carry wording the statement does not determine. This file re-scores every trained model's
holdout with a meaning-based judge: an answer counts as correct when it states the same
values and the same verdict/selection as the oracle, regardless of wording, order, unit
naming, punctuation, or explanatory prose.

Method:
- Every `answer_mismatch` row of every model's holdout (2,264 rows across 24 models) was
  re-judged. A deterministic pre-filter rejected any row where an oracle number is missing
  from the model answer (1,431 rows). The remaining 833 rows were judged by four independent
  subagents against the strict criterion "same verdict/selection/claim; numbers already match;
  wording does not matter" (440 judged semantically correct). Execution errors are NOT
  rescued: a circuit that fails to run stays failed.

## Per-model: exact vs semantic

| model | items | exact | semantic | rate | rescued |
|---|---|---|---|---|---|
| exp-021-1.7b-qwen3-dv7 (containers) | 705 | 460 | 544 | 77.2% | 84 |
| exp-025-1.7b-qwen3-dv12 (simplified statements) | 705 | 432 | 500 | 70.9% | 68 |
| exp-023-1.7b-qwen3-dv9 (containers on stuck books) | 705 | 428 | 490 | 69.5% | 62 |
| exp-024-1.7b-qwen3-dv11 (compact answers) | 705 | 439 | 473 | 67.1% | 34 |
| exp-022-1.7b-qwen3-dv8 (modular) | 705 | 448 | 468 | 66.4% | 20 |
| exp-019-1.7b-qwen3-dv5 | 705 | 442 | 465 | 66.0% | 23 |
| exp-017-qwen3-17b | 705 | 442 | 457 | 64.8% | 15 |
| exp-018-1.7b-qwen3-dv4 | 705 | 436 | 453 | 64.3% | 17 |
| exp-016-wires | 705 | 440 | 445 | 63.1% | 5 |
| exp-014-deep-chains | 705 | 379 | 438 | 62.1% | 59 |
| exp-013-1.5b | 585 | 322 | 340 | 58.1% | 18 |
| exp-015-deep-chains-05 | 705 | 362 | 372 | 52.8% | 10 |
| exp-012-census | 585 | 258 | 262 | 44.8% | 4 |
| exp-011-compositions | 425 | 161 | 163 | 38.4% | 2 |
| exp-005-sft-widened | 265 | 1 | 9 | 3.4% | 8 |
| exp-010-contrastive | 265 | 1 | 3 | 1.1% | 2 |
| exp-002-sft-lr2e-5 | 225 | 0 | 2 | 0.9% | 2 |
| exp-007-sft-wires | 265 | 1 | 2 | 0.8% | 1 |
| exp-008-sft-shapes | 265 | 1 | 2 | 0.8% | 1 |
| exp-009-mix10 | 265 | 0 | 2 | 0.8% | 2 |
| exp-003-sft-lr1e-4-q4-k-m | 265 | 0 | 1 | 0.4% | 1 |
| exp-003-sft-lr1e-4-q8-0 | 265 | 0 | 1 | 0.4% | 1 |
| exp-004-lora | 265 | 0 | 1 | 0.4% | 1 |
| exp-003-sft-lr1e-4 | 225 | 0 | 0 | 0.0% | 0 |

(The very old arms scored on fewer items; their holdouts were smaller.)

## Per-book semantic, headline arms (exact -> semantic)

| arm | procedural | world | decompose-to-solve | common-sense | scientific |
|---|---|---|---|---|---|
| dv7 containers | 438->443/480 | 20->20/20 | 0->66/100 | 0->6/50 | 0->2/25 |
| dv12 simplified statements | 409->413/480 | 20->20/20 | 0->54/100 | 0->0/50 | 0->1/25 |
| dv9 containers-on-stuck | 410->414/480 | 16->16/20 | 0->36/100 | 0->13/50 | 0->5/25 |
| dv11 compact answers | 416->418/480 | 20->20/20 | 0->7/100 | 0->9/50 | 0->6/25 |
| dv8 modular | 410->430/480 | 20->20/20 | 0->0/100 | 0->3/50 | 0->8/25 |
| qwen3-17b | 439->443/480 | 0->0/20 | 0->0/100 | 0->2/50 | 0->4/25 |

## Conclusions

1. The exact-phrase comparison was understating every model, most of all on decompose-to-solve:
   the dv7 container arm actually computes 66 of 100 of those problems correctly, not zero.
2. The container arm (dv7) remains the best under semantic scoring: 77.2% overall, and it is
   the only arm that moved decompose-to-solve (0 -> 66) and kept world 20/20.
3. The simplified-statements arm (dv12) did NOT beat containers: 70.9% overall and 54/100 on
   decompose, against dv7's 77.2% and 66/100.
4. common-sense stays near zero semantically in almost every arm (best is dv9 at 13/50); the
   one historical exception is exp-014-deep-chains at 49/50, which is worth revisiting.
5. Recommendation: adopt a value-based answer comparison (numbers plus verdict/selection) as
   the benchmark's scorer, so the reported scores measure computation, not phrase reproduction.
