# Trainer-view export report

Derived by `training/export.mjs` from the shipped trees under `training-data/`;
dataset snapshot `6e5605dabfb574329072bae37c6cd0cb2e20a2fe3ebb77b144df82e7d165fa9d`. The report is deterministic and carries no timestamp.

| book | rows | no-knowledge | knowledge | templates | plans |
| --- | --- | --- | --- | --- | --- |
| adult-reasoning | 990 | 990 | 0 | 99 | 99 |
| common-sense | 950 | 950 | 0 | 19 | 19 |
| decompose-to-solve | 900 | 900 | 0 | 9 | 9 |
| logical-reasoning | 990 | 990 | 0 | 99 | 99 |
| mathematical-thinking | 990 | 935 | 55 | 600 | 579 |
| procedural-arithmetic | 3160 | 3160 | 0 | 79 | 79 |
| scientific-reasoning | 975 | 950 | 25 | 39 | 39 |
| world-as-a-system | 980 | 980 | 0 | 196 | 49 |
| all books | 9935 | 9855 | 80 | 1139 | 972 |

## Distributions

Measured over the exported training rows before tokenization. `statement characters` is the user
message, `target characters` the assistant message, `wire declarations` the `@name command` lines
of the solution, `jsEval body lines` the non-empty lines after the `jsEval` declaration, and
`$ dependencies` the distinct `$name` references of the solution text.

| book | measure | min | p50 | p90 | p99 | max |
| --- | --- | --- | --- | --- | --- | --- |
| adult-reasoning | statement characters | 119 | 329 | 511 | 1075 | 1084 |
| adult-reasoning | target characters | 302 | 851 | 1434 | 2473 | 2480 |
| adult-reasoning | wire declarations | 2 | 2 | 3 | 5 | 5 |
| adult-reasoning | jsEval body lines | 2 | 8 | 19 | 33 | 33 |
| adult-reasoning | $ dependencies | 1 | 1 | 2 | 4 | 4 |
| common-sense | statement characters | 408 | 507 | 633 | 641 | 641 |
| common-sense | target characters | 791 | 1623 | 2310 | 2713 | 2713 |
| common-sense | wire declarations | 3 | 4 | 5 | 5 | 5 |
| common-sense | jsEval body lines | 10 | 22 | 36 | 42 | 42 |
| common-sense | $ dependencies | 2 | 3 | 4 | 4 | 4 |
| decompose-to-solve | statement characters | 522 | 679 | 790 | 812 | 838 |
| decompose-to-solve | target characters | 950 | 1522 | 2799 | 2803 | 2805 |
| decompose-to-solve | wire declarations | 3 | 4 | 5 | 5 | 5 |
| decompose-to-solve | jsEval body lines | 12 | 18 | 41 | 41 | 41 |
| decompose-to-solve | $ dependencies | 2 | 3 | 4 | 4 | 4 |
| logical-reasoning | statement characters | 221 | 352 | 419 | 510 | 519 |
| logical-reasoning | target characters | 219 | 423 | 749 | 2086 | 2095 |
| logical-reasoning | wire declarations | 2 | 2 | 2 | 4 | 4 |
| logical-reasoning | jsEval body lines | 2 | 2 | 6 | 20 | 20 |
| logical-reasoning | $ dependencies | 1 | 1 | 1 | 2 | 2 |
| mathematical-thinking | statement characters | 57 | 176 | 243 | 351 | 356 |
| mathematical-thinking | target characters | 110 | 337 | 792 | 1579 | 1844 |
| mathematical-thinking | wire declarations | 2 | 2 | 3 | 4 | 6 |
| mathematical-thinking | jsEval body lines | 2 | 6 | 14 | 26 | 42 |
| mathematical-thinking | $ dependencies | 1 | 1 | 2 | 3 | 5 |
| procedural-arithmetic | statement characters | 70 | 190 | 272 | 653 | 678 |
| procedural-arithmetic | target characters | 158 | 673 | 1517 | 2553 | 2562 |
| procedural-arithmetic | wire declarations | 2 | 2 | 4 | 7 | 7 |
| procedural-arithmetic | jsEval body lines | 2 | 14 | 21 | 48 | 48 |
| procedural-arithmetic | $ dependencies | 1 | 1 | 3 | 5 | 5 |
| scientific-reasoning | statement characters | 578 | 869 | 1149 | 1361 | 1545 |
| scientific-reasoning | target characters | 321 | 1313 | 2737 | 4480 | 4516 |
| scientific-reasoning | wire declarations | 2 | 3 | 5 | 6 | 6 |
| scientific-reasoning | jsEval body lines | 2 | 13 | 31 | 46 | 46 |
| scientific-reasoning | $ dependencies | 1 | 2 | 4 | 5 | 5 |
| world-as-a-system | statement characters | 395 | 644 | 974 | 1306 | 1403 |
| world-as-a-system | target characters | 353 | 2320 | 3559 | 5909 | 6025 |
| world-as-a-system | wire declarations | 2 | 4 | 6 | 9 | 9 |
| world-as-a-system | jsEval body lines | 4 | 46 | 70 | 94 | 94 |
| world-as-a-system | $ dependencies | 1 | 3 | 5 | 8 | 8 |
| all books | statement characters | 57 | 336 | 796 | 1217 | 1545 |
| all books | target characters | 110 | 849 | 2200 | 3657 | 6025 |
| all books | wire declarations | 2 | 2 | 4 | 7 | 9 |
| all books | jsEval body lines | 2 | 13 | 41 | 70 | 94 |
| all books | $ dependencies | 1 | 1 | 3 | 5 | 8 |

## Longest targets

| folder | target characters |
| --- | --- |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/823-cause-and-consequence-chain-case-3 | 6025 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/573-cause-and-consequence-chain-case-3 | 5970 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/323-cause-and-consequence-chain-case-3 | 5949 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/574-cause-and-consequence-chain-case-4 | 5912 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/322-cause-and-consequence-chain-case-2 | 5911 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/822-cause-and-consequence-chain-case-2 | 5911 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/324-cause-and-consequence-chain-case-4 | 5910 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/824-cause-and-consequence-chain-case-4 | 5910 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/572-cause-and-consequence-chain-case-2 | 5909 |
| world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/821-cause-and-consequence-chain-case-1 | 5909 |

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
