# Trainer-view export report

Derived by `training/export.mjs` from the shipped trees under `training-data/`;
dataset snapshot `390211ea6a9bb711750b128b414ce9f5d4fc093db42d545f9eca01cd22d7495e`. The report is deterministic and carries no timestamp.

| book | rows | no-knowledge | knowledge | templates | plans |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 990 | 990 | 0 | 99 | 99 |
| common-sense | 950 | 950 | 0 | 19 | 19 |
| decompose-to-solve | 900 | 900 | 0 | 9 | 9 |
| logical-reasoning | 990 | 990 | 0 | 99 | 99 |
| mathematical-thinking | 990 | 935 | 55 | 600 | 579 |
| procedural-arithmetic | 560 | 560 | 0 | 14 | 14 |
| scientific-reasoning | 975 | 950 | 25 | 39 | 39 |
| world-as-a-system | 980 | 980 | 0 | 196 | 49 |
| all books | 7335 | 7255 | 80 | 1074 | 907 |

## Distributions

Measured over the exported training rows before tokenization. `statement characters` is the user
message, `target characters` the assistant message, `wire declarations` the `@name command` lines
of the solution, `jsEval body lines` the non-empty lines after the `jsEval` declaration, and
`$ dependencies` the distinct `$name` references of the solution text.

| book | measure | min | p50 | p90 | p99 | max |
| --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | statement characters | 119 | 329 | 511 | 1075 | 1084 |
| adult-reasoning | target characters | 1409 | 2215 | 2806 | 3491 | 3497 |
| adult-reasoning | wire declarations | 2 | 2 | 2 | 2 | 2 |
| adult-reasoning | jsEval body lines | 15 | 23 | 31 | 43 | 43 |
| adult-reasoning | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| common-sense | statement characters | 408 | 507 | 633 | 641 | 641 |
| common-sense | target characters | 1629 | 2449 | 3508 | 3728 | 3728 |
| common-sense | wire declarations | 2 | 2 | 2 | 2 | 2 |
| common-sense | jsEval body lines | 19 | 30 | 46 | 46 | 46 |
| common-sense | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| decompose-to-solve | statement characters | 522 | 679 | 790 | 812 | 838 |
| decompose-to-solve | target characters | 1701 | 2647 | 4313 | 4317 | 4319 |
| decompose-to-solve | wire declarations | 2 | 2 | 2 | 2 | 2 |
| decompose-to-solve | jsEval body lines | 16 | 30 | 53 | 53 | 53 |
| decompose-to-solve | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| logical-reasoning | statement characters | 221 | 352 | 419 | 510 | 519 |
| logical-reasoning | target characters | 1125 | 1646 | 2216 | 4087 | 4096 |
| logical-reasoning | wire declarations | 2 | 2 | 2 | 2 | 2 |
| logical-reasoning | jsEval body lines | 12 | 15 | 19 | 32 | 32 |
| logical-reasoning | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| mathematical-thinking | statement characters | 57 | 176 | 243 | 351 | 356 |
| mathematical-thinking | target characters | 608 | 837 | 1298 | 2312 | 2948 |
| mathematical-thinking | wire declarations | 2 | 2 | 2 | 3 | 3 |
| mathematical-thinking | jsEval body lines | 9 | 13 | 22 | 37 | 47 |
| mathematical-thinking | $ dependencies | 1 | 1 | 1 | 2 | 2 |
| procedural-arithmetic | statement characters | 70 | 133 | 223 | 249 | 252 |
| procedural-arithmetic | target characters | 1022 | 1492 | 2378 | 3101 | 3111 |
| procedural-arithmetic | wire declarations | 2 | 2 | 3 | 4 | 4 |
| procedural-arithmetic | jsEval body lines | 13 | 20 | 33 | 42 | 42 |
| procedural-arithmetic | $ dependencies | 1 | 1 | 2 | 3 | 3 |
| scientific-reasoning | statement characters | 578 | 869 | 1149 | 1361 | 1545 |
| scientific-reasoning | target characters | 1445 | 2467 | 3933 | 5413 | 5449 |
| scientific-reasoning | wire declarations | 2 | 2 | 2 | 3 | 3 |
| scientific-reasoning | jsEval body lines | 14 | 25 | 41 | 59 | 59 |
| scientific-reasoning | $ dependencies | 1 | 1 | 1 | 2 | 2 |
| world-as-a-system | statement characters | 395 | 644 | 974 | 1306 | 1403 |
| world-as-a-system | target characters | 1484 | 3251 | 4323 | 5983 | 6054 |
| world-as-a-system | wire declarations | 2 | 2 | 2 | 2 | 2 |
| world-as-a-system | jsEval body lines | 16 | 54 | 77 | 105 | 105 |
| world-as-a-system | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| all books | statement characters | 57 | 459 | 859 | 1249 | 1545 |
| all books | target characters | 608 | 2147 | 3482 | 4629 | 6054 |
| all books | wire declarations | 2 | 2 | 2 | 3 | 4 |
| all books | jsEval body lines | 9 | 22 | 51 | 91 | 105 |
| all books | $ dependencies | 1 | 1 | 1 | 2 | 3 |

## Longest targets

| folder | target characters |
| --- | --- |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-3/746-meta-reasoning-case-1 | 6054 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/496-meta-reasoning-case-1 | 6052 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/996-meta-reasoning-case-1 | 6052 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/823-cause-and-consequence-chain-case-3 | 6046 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-3/750-meta-reasoning-case-5 | 6015 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/500-meta-reasoning-case-5 | 6013 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/1000-meta-reasoning-case-5 | 6013 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/573-cause-and-consequence-chain-case-3 | 5991 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/498-meta-reasoning-case-3 | 5983 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/998-meta-reasoning-case-3 | 5983 |

## Longest statements

| folder | statement characters |
| --- | --- |
| scientific-reasoning/no-knowledge/classification-by-multiple-rules/101-classification-by-multiple-rules | 1545 |
| scientific-reasoning/no-knowledge/choice-under-multiple-conditions/104-choice-under-multiple-conditions | 1527 |
| scientific-reasoning/no-knowledge/classification-by-multiple-rules/51-classification-by-multiple-rules | 1512 |
| scientific-reasoning/no-knowledge/choice-under-multiple-conditions/54-choice-under-multiple-conditions | 1489 |
| scientific-reasoning/no-knowledge/elimination-by-clues/105-elimination-by-clues | 1439 |
| scientific-reasoning/no-knowledge/multi-step-synthesis/477-multi-step-synthesis | 1434 |
| world-as-a-system/no-knowledge/perspective-interest-and-source-credibility-grade-3/699-perspective-interest-and-source-quality-case-4 | 1403 |
| world-as-a-system/no-knowledge/perspective-interest-and-source-credibility-grade-4/947-perspective-interest-and-source-quality-case-2 | 1402 |
| scientific-reasoning/no-knowledge/classification-by-multiple-rules/81-classification-by-multiple-rules | 1379 |
| scientific-reasoning/no-knowledge/quantifiers-all-some-none/617-quantifiers-all-some-none | 1375 |

## Validation slice

Seed 3407, 339 rows, one quota per book (per-book quota of the 5% slice, seeded Fisher-Yates (mulberry32) over each book's export order, plan-disjoint first, folders sorted).
The trainer excludes these folder ids from training. Rows were preferred plan-disjoint, so a library
with fewer plans than its quota (common-sense) reuses plans; the table below records the plan counts.

| book | validation rows | plans in the book | validation rows on a reused plan |
| --- | --- | --- | --- |
| adult-reasoning | 49 | 99 | 0 |
| common-sense | 49 | 19 | 30 |
| decompose-to-solve | 49 | 9 | 40 |
| logical-reasoning | 48 | 99 | 0 |
| mathematical-thinking | 48 | 579 | 0 |
| scientific-reasoning | 48 | 39 | 9 |
| world-as-a-system | 48 | 49 | 0 |
