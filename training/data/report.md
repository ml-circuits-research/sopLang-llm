# Trainer-view export report

Derived by `training/export.mjs` from the shipped trees under `training-data/`;
dataset snapshot `0087f889b584689e7814fc1440fa5213fe4bc20c1356c73773a45bf0e6173aa7`. The report is deterministic and carries no timestamp.

| book | rows | no-knowledge | knowledge | templates | plans |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 990 | 990 | 0 | 99 | 99 |
| common-sense | 950 | 950 | 0 | 19 | 19 |
| decompose-to-solve | 900 | 900 | 0 | 9 | 9 |
| logical-reasoning | 990 | 990 | 0 | 99 | 99 |
| mathematical-thinking | 990 | 935 | 55 | 600 | 579 |
| procedural-arithmetic | 2880 | 2880 | 0 | 72 | 72 |
| scientific-reasoning | 975 | 950 | 25 | 39 | 39 |
| world-as-a-system | 980 | 980 | 0 | 196 | 49 |
| all books | 9655 | 9575 | 80 | 1132 | 965 |

## Distributions

Measured over the exported training rows before tokenization. `statement characters` is the user
message, `target characters` the assistant message, `wire declarations` the `@name command` lines
of the solution, `jsEval body lines` the non-empty lines after the `jsEval` declaration, and
`$ dependencies` the distinct `$name` references of the solution text.

| book | measure | min | p50 | p90 | p99 | max |
| --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | statement characters | 119 | 329 | 511 | 1075 | 1084 |
| adult-reasoning | target characters | 302 | 848 | 1365 | 2205 | 2212 |
| adult-reasoning | wire declarations | 2 | 2 | 2 | 2 | 2 |
| adult-reasoning | jsEval body lines | 2 | 8 | 16 | 26 | 26 |
| adult-reasoning | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| common-sense | statement characters | 408 | 507 | 633 | 641 | 641 |
| common-sense | target characters | 635 | 1172 | 2024 | 2563 | 2563 |
| common-sense | wire declarations | 2 | 2 | 2 | 2 | 2 |
| common-sense | jsEval body lines | 5 | 17 | 33 | 34 | 34 |
| common-sense | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| decompose-to-solve | statement characters | 522 | 679 | 790 | 812 | 838 |
| decompose-to-solve | target characters | 615 | 1440 | 2349 | 2353 | 2355 |
| decompose-to-solve | wire declarations | 2 | 2 | 2 | 2 | 2 |
| decompose-to-solve | jsEval body lines | 4 | 17 | 33 | 33 | 33 |
| decompose-to-solve | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| logical-reasoning | statement characters | 221 | 352 | 419 | 510 | 519 |
| logical-reasoning | target characters | 219 | 423 | 749 | 1791 | 1800 |
| logical-reasoning | wire declarations | 2 | 2 | 2 | 2 | 2 |
| logical-reasoning | jsEval body lines | 2 | 2 | 6 | 15 | 15 |
| logical-reasoning | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| mathematical-thinking | statement characters | 57 | 176 | 243 | 351 | 356 |
| mathematical-thinking | target characters | 110 | 339 | 800 | 1814 | 2450 |
| mathematical-thinking | wire declarations | 2 | 2 | 2 | 3 | 3 |
| mathematical-thinking | jsEval body lines | 2 | 6 | 15 | 30 | 40 |
| mathematical-thinking | $ dependencies | 1 | 1 | 1 | 2 | 2 |
| procedural-arithmetic | statement characters | 70 | 188 | 256 | 316 | 432 |
| procedural-arithmetic | target characters | 158 | 665 | 1265 | 2554 | 2562 |
| procedural-arithmetic | wire declarations | 2 | 2 | 4 | 5 | 5 |
| procedural-arithmetic | jsEval body lines | 2 | 14 | 21 | 48 | 48 |
| procedural-arithmetic | $ dependencies | 1 | 1 | 3 | 4 | 4 |
| scientific-reasoning | statement characters | 578 | 869 | 1149 | 1361 | 1545 |
| scientific-reasoning | target characters | 321 | 1272 | 2508 | 4450 | 4486 |
| scientific-reasoning | wire declarations | 2 | 2 | 2 | 3 | 3 |
| scientific-reasoning | jsEval body lines | 2 | 11 | 28 | 43 | 43 |
| scientific-reasoning | $ dependencies | 1 | 1 | 1 | 2 | 2 |
| world-as-a-system | statement characters | 395 | 644 | 974 | 1306 | 1403 |
| world-as-a-system | target characters | 353 | 2282 | 3311 | 5096 | 5212 |
| world-as-a-system | wire declarations | 2 | 2 | 2 | 2 | 2 |
| world-as-a-system | jsEval body lines | 4 | 43 | 66 | 93 | 93 |
| world-as-a-system | $ dependencies | 1 | 1 | 1 | 1 | 1 |
| all books | statement characters | 57 | 342 | 799 | 1222 | 1545 |
| all books | target characters | 110 | 777 | 2116 | 3473 | 5212 |
| all books | wire declarations | 2 | 2 | 2 | 4 | 5 |
| all books | jsEval body lines | 2 | 11 | 37 | 66 | 93 |
| all books | $ dependencies | 1 | 1 | 1 | 3 | 4 |

## Longest targets

| folder | target characters |
| --- | --- |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/823-cause-and-consequence-chain-case-3 | 5212 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/573-cause-and-consequence-chain-case-3 | 5157 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/323-cause-and-consequence-chain-case-3 | 5136 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/574-cause-and-consequence-chain-case-4 | 5099 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/322-cause-and-consequence-chain-case-2 | 5098 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/822-cause-and-consequence-chain-case-2 | 5098 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/324-cause-and-consequence-chain-case-4 | 5097 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/824-cause-and-consequence-chain-case-4 | 5097 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/572-cause-and-consequence-chain-case-2 | 5096 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/821-cause-and-consequence-chain-case-1 | 5096 |

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
