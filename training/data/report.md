# Trainer-view export report

Derived by `training/export.mjs` from the shipped trees under `training-data/`;
dataset snapshot `423800be9ba8d08663c245c29f6a498928335eb26e97431154eaff7bd45e20fb`. The report is deterministic and carries no timestamp.

| book | rows | no-knowledge | knowledge | templates | plans |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 990 | 990 | 0 | 99 | 99 |
| common-sense | 950 | 950 | 0 | 19 | 19 |
| decompose-to-solve | 900 | 900 | 0 | 9 | 9 |
| logical-reasoning | 990 | 990 | 0 | 99 | 99 |
| mathematical-thinking | 990 | 935 | 55 | 600 | 579 |
| procedural-arithmetic | 1960 | 1960 | 0 | 49 | 49 |
| scientific-reasoning | 975 | 950 | 25 | 39 | 39 |
| world-as-a-system | 980 | 980 | 0 | 196 | 49 |
| all books | 8735 | 8655 | 80 | 1109 | 942 |

## Distributions

Measured over the exported training rows before tokenization. `statement characters` is the user
message, `target characters` the assistant message, `wire declarations` the `@name command` lines
of the solution, `jsEval body lines` the non-empty lines after the `jsEval` declaration, and
`$ dependencies` the distinct `$name` references of the solution text.

| book | measure | min | p50 | p90 | p99 | max |
| --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | statement characters | 119 | 329 | 511 | 1075 | 1084 |
| adult-reasoning | target characters | 1019 | 1825 | 2416 | 3101 | 3107 |
| adult-reasoning | wire declarations | 2 | 2 | 2 | 2 | 2 |
| adult-reasoning | jsEval body lines | 9 | 17 | 25 | 37 | 37 |
| adult-reasoning | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| common-sense | statement characters | 408 | 507 | 633 | 641 | 641 |
| common-sense | target characters | 1239 | 2059 | 3118 | 3338 | 3338 |
| common-sense | wire declarations | 2 | 2 | 2 | 2 | 2 |
| common-sense | jsEval body lines | 13 | 24 | 40 | 40 | 40 |
| common-sense | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| decompose-to-solve | statement characters | 522 | 679 | 790 | 812 | 838 |
| decompose-to-solve | target characters | 1311 | 2257 | 3923 | 3927 | 3929 |
| decompose-to-solve | wire declarations | 2 | 2 | 2 | 2 | 2 |
| decompose-to-solve | jsEval body lines | 10 | 24 | 47 | 47 | 47 |
| decompose-to-solve | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| logical-reasoning | statement characters | 221 | 352 | 419 | 510 | 519 |
| logical-reasoning | target characters | 735 | 1256 | 1826 | 3697 | 3706 |
| logical-reasoning | wire declarations | 2 | 2 | 2 | 2 | 2 |
| logical-reasoning | jsEval body lines | 6 | 9 | 13 | 26 | 26 |
| logical-reasoning | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| mathematical-thinking | statement characters | 57 | 176 | 243 | 351 | 356 |
| mathematical-thinking | target characters | 110 | 339 | 800 | 1814 | 2450 |
| mathematical-thinking | wire declarations | 2 | 2 | 2 | 3 | 3 |
| mathematical-thinking | jsEval body lines | 2 | 6 | 15 | 30 | 40 |
| mathematical-thinking | $ dependencies | 1 | 1 | 1 | 2 | 2 |
| procedural-arithmetic | statement characters | 70 | 168 | 246 | 280 | 285 |
| procedural-arithmetic | target characters | 449 | 1038 | 2702 | 3647 | 3654 |
| procedural-arithmetic | wire declarations | 2 | 2 | 4 | 4 | 4 |
| procedural-arithmetic | jsEval body lines | 6 | 17 | 31 | 43 | 43 |
| procedural-arithmetic | $ dependencies | 1 | 1 | 3 | 3 | 3 |
| scientific-reasoning | statement characters | 578 | 869 | 1149 | 1361 | 1545 |
| scientific-reasoning | target characters | 1055 | 2077 | 3543 | 5023 | 5059 |
| scientific-reasoning | wire declarations | 2 | 2 | 2 | 3 | 3 |
| scientific-reasoning | jsEval body lines | 8 | 19 | 35 | 53 | 53 |
| scientific-reasoning | $ dependencies | 1 | 1 | 1 | 2 | 2 |
| world-as-a-system | statement characters | 395 | 644 | 974 | 1306 | 1403 |
| world-as-a-system | target characters | 1094 | 2861 | 3933 | 5593 | 5664 |
| world-as-a-system | wire declarations | 2 | 2 | 2 | 2 | 2 |
| world-as-a-system | jsEval body lines | 10 | 48 | 71 | 99 | 99 |
| world-as-a-system | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| all books | statement characters | 57 | 385 | 821 | 1231 | 1545 |
| all books | target characters | 110 | 1661 | 3057 | 4162 | 5664 |
| all books | wire declarations | 2 | 2 | 2 | 4 | 4 |
| all books | jsEval body lines | 2 | 17 | 43 | 71 | 99 |
| all books | $ dependencies | 1 | 1 | 1 | 3 | 3 |

## Longest targets

| folder | target characters |
| --- | --- |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-3/746-meta-reasoning-case-1 | 5664 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/496-meta-reasoning-case-1 | 5662 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/996-meta-reasoning-case-1 | 5662 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/823-cause-and-consequence-chain-case-3 | 5656 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-3/750-meta-reasoning-case-5 | 5625 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/500-meta-reasoning-case-5 | 5623 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/1000-meta-reasoning-case-5 | 5623 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/573-cause-and-consequence-chain-case-3 | 5601 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/498-meta-reasoning-case-3 | 5593 |
| world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/998-meta-reasoning-case-3 | 5593 |

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
