# data-quality: jsEval body complexity scan

Run: 2026-09-26T01:24:30.164Z

## Thresholds in effect

| metric | threshold | env override |
|---|---|---|
| lines | `> 15` | `DQ_MAX_LINES` |
| loops | `> 2` | `DQ_MAX_LOOPS` |
| chains | `> 3` | `DQ_MAX_CHAINS` |
| variables | `> 6` | `DQ_MAX_VARIABLES` |
| depth | `> 3` | `DQ_MAX_DEPTH` |

## Totals

- solution.sop files scanned: **10640**
- the bloat indicator: **2.90** wires per plan against **15.8** jsEval lines per plan (5.4 lines per wire); **290** plans carry `<= 3 wires but > 25 jsEval lines` — too few wires for the JavaScript mass
- jsEval bodies scanned: **19301**
- bodies flagged MONSTROUS: **3676** (19.0% of bodies)
- files with a flagged body: **3304** (31.1% of files)
- wire-discovery top shapes available for candidate matching: **0**
- wire-discovery top shapes still present in the current dataset: **0** (0 bodies)

## Per-metric trips

A body may exceed several thresholds; each row counts bodies that trip that one metric.

| metric | threshold | bodies | share of all bodies |
|---|---|---|---|
| lines | `> 15` | 1640 | 8.5% |
| loops | `> 2` | 190 | 1.0% |
| chains | `> 3` | 677 | 3.5% |
| variables | `> 6` | 3084 | 16.0% |
| depth | `> 3` | 27 | 0.1% |

## Thresholds tripped per flagged body

| tripped | bodies | share of flagged |
|---|---|---|
| 1 | 1912 | 52.0% |
| 2 | 1586 | 43.1% |
| 3 | 178 | 4.8% |

## Suggestion distribution

| suggestion | bodies | share of flagged |
|---|---|---|
| container | 2601 | 70.8% |
| aggregate | 752 | 20.5% |
| graphPath | 170 | 4.6% |
| fraction | 153 | 4.2% |
| candidate | 0 | 0.0% |

`candidate` matches a body's normalized shape against the top shapes in the current
wire-discovery report. A zero here means none of the flagged bodies is one of those
top shapes — usually because the wire-discovery report predates the last rebuild
(its measured shapes no longer occur verbatim, or the surviving shapes map to an
existing wire such as `graphPath`). Re-run wire-discovery, then re-run this tool, and
the candidate bucket repopulates.

## Flagged bodies by family

- affected families: **286**

| family | flagged bodies |
|---|---|
| atomic-case-coupled-objective | 100 |
| competing-alternatives | 100 |
| ten-part-integrated-decomposition | 100 |
| bottlenecks | 50 |
| break-even-threshold | 50 |
| budget-and-constraints | 50 |
| causality | 50 |
| chained-yields | 50 |
| data-consistency | 50 |
| expected-value-and-risk | 50 |
| marginal-allocation | 50 |
| mean-versus-median | 50 |
| robustness | 50 |
| weighted-averages | 50 |
| counterfactual-reasoning | 50 |
| minimum-intervention-in-a-system | 50 |
| above-total-percent-discount | 40 |
| below-total-per-unit-subtract-rate | 40 |
| above-count-per-unit-add-rate | 40 |
| above-largest-per-unit-subtract-rate | 40 |
| above-smallest-per-unit-add-rate | 40 |
| above-total-double-per-unit-add-rate | 40 |
| above-total-modulo-add-rate | 40 |
| above-total-per-unit-add-rate | 40 |
| below-count-elapsed-add-rate | 40 |
| below-count-per-unit-add-rate | 40 |
| below-count-rectangle-add-rate | 40 |
| below-largest-per-unit-double-add-rate | 40 |
| below-total-double-subtract-rate | 40 |
| cheaper-rate-per-unit | 40 |
| evidence-tree-elimination | 40 |
| grouped-label-totals | 40 |
| length-ranked-words | 40 |
| minimal-winning-coalition | 40 |
| net-balance-with-withdrawals | 40 |
| route-summary-selection | 40 |
| schedule-deadline-feasibility | 40 |
| schedule-finish-time | 40 |
| task-prerequisite-count | 40 |
| vowel-richest-word | 40 |
| minimum-information-needed | 25 |
| order-and-sequence | 25 |
| discovering-a-rule-from-examples | 25 |
| dominance-and-multi-criteria-trade-offs | 25 |
| error-deviation-and-reconciliation-of-measurements | 25 |
| exhaustive-case-analysis | 25 |
| optimization-under-constraints | 25 |
| planning-with-partial-dependencies | 25 |
| quantifiers-all-some-none | 25 |
| reading-and-explaining-data | 25 |
| robust-decision-making-under-uncertainty | 25 |
| sets-intersections-and-differences | 25 |
| spatial-relationships-and-orientation | 25 |
| structural-analogy-between-systems | 25 |
| meta-reasoning-robustness-information-causality-grade-1 | 20 |
| meta-reasoning-robustness-information-causality-grade-2 | 20 |
| meta-reasoning-robustness-information-causality-grade-3 | 20 |
| meta-reasoning-robustness-information-causality-grade-4 | 20 |
| causes-conditions-and-consequences-grade-1 | 15 |
| causes-conditions-and-consequences-grade-2 | 15 |
| causes-conditions-and-consequences-grade-3 | 15 |
| causes-conditions-and-consequences-grade-4 | 15 |
| genealogy-and-generations-grade-1 | 15 |
| genealogy-and-generations-grade-2 | 15 |
| genealogy-and-generations-grade-3 | 15 |
| genealogy-and-generations-grade-4 | 15 |
| a-public-counters-opening-hours | 10 |
| a-synthesis-from-several-fragments | 10 |
| an-extract-from-an-employment-contract | 10 |
| comparing-two-or-three-offers | 10 |
| contracts-and-plain-clauses | 10 |
| density-weight-and-floating | 10 |
| food-chains-in-a-described-ecosystem | 10 |
| frequency-chance-and-expected-number | 10 |
| hours-breaks-and-overtime | 10 |
| internal-rules-and-sanctions | 10 |
| letters-messages-and-addressees | 10 |
| maps-and-legends-described | 10 |
| news-headline-and-body | 10 |
| sleep-rest-and-daily-rhythm | 10 |
| source-claim-and-evidence | 10 |
| speed-duration-and-distance | 10 |
| time-zones-from-a-given-table | 10 |
| absolute-change-and-relative-change | 10 |
| climate-from-data-grade-1 | 10 |
| climate-from-data-grade-2 | 10 |
| climate-from-data-grade-3 | 10 |
| climate-from-data-grade-4 | 10 |
| density-capacity-and-crowding-grade-1 | 10 |
| density-capacity-and-crowding-grade-2 | 10 |
| density-capacity-and-crowding-grade-3 | 10 |
| density-capacity-and-crowding-grade-4 | 10 |
| ecosystems-and-indirect-effects-grade-1 | 10 |
| ecosystems-and-indirect-effects-grade-2 | 10 |
| ecosystems-and-indirect-effects-grade-3 | 10 |
| ecosystems-and-indirect-effects-grade-4 | 10 |
| exchange-routes-and-capacities-grade-1 | 10 |
| exchange-routes-and-capacities-grade-2 | 10 |
| exchange-routes-and-capacities-grade-3 | 10 |
| exchange-routes-and-capacities-grade-4 | 10 |
| institutions-and-roles-grade-1 | 10 |
| institutions-and-roles-grade-2 | 10 |
| institutions-and-roles-grade-3 | 10 |
| institutions-and-roles-grade-4 | 10 |
| land-use-and-spatial-compatibility-grade-1 | 10 |
| land-use-and-spatial-compatibility-grade-2 | 10 |
| land-use-and-spatial-compatibility-grade-3 | 10 |
| land-use-and-spatial-compatibility-grade-4 | 10 |
| layers-and-dating-objects-grade-1 | 10 |
| layers-and-dating-objects-grade-2 | 10 |
| layers-and-dating-objects-grade-3 | 10 |
| layers-and-dating-objects-grade-4 | 10 |
| public-budgets-and-priorities-grade-1 | 10 |
| public-budgets-and-priorities-grade-2 | 10 |
| public-budgets-and-priorities-grade-3 | 10 |
| public-budgets-and-priorities-grade-4 | 10 |
| representation-and-seats-grade-1 | 10 |
| representation-and-seats-grade-2 | 10 |
| representation-and-seats-grade-3 | 10 |
| representation-and-seats-grade-4 | 10 |
| timeline | 5 |
| coins-with-given-values | 5 |
| maximum-minimum-and-ties | 5 |
| order-in-a-line | 5 |
| scheduling-four-tasks | 5 |
| shortest-path-in-a-state-space | 5 |
| who-has-the-longest-object | 5 |
| negotiation-coalitions-and-agreement-grade-1 | 5 |
| negotiation-coalitions-and-agreement-grade-2 | 5 |
| negotiation-coalitions-and-agreement-grade-3 | 5 |
| negotiation-coalitions-and-agreement-grade-4 | 5 |
| anachronisms-and-temporal-compatibility-grade-1 | 5 |
| anachronisms-and-temporal-compatibility-grade-2 | 5 |
| anachronisms-and-temporal-compatibility-grade-3 | 5 |
| anachronisms-and-temporal-compatibility-grade-4 | 5 |
| change-and-continuity-grade-1 | 5 |
| change-and-continuity-grade-2 | 5 |
| change-and-continuity-grade-3 | 5 |
| change-and-continuity-grade-4 | 5 |
| choosing-a-settlement-site-grade-1 | 5 |
| choosing-a-settlement-site-grade-2 | 5 |
| choosing-a-settlement-site-grade-3 | 5 |
| choosing-a-settlement-site-grade-4 | 5 |
| collective-choice-and-preferences-grade-1 | 5 |
| collective-choice-and-preferences-grade-2 | 5 |
| collective-choice-and-preferences-grade-3 | 5 |
| collective-choice-and-preferences-grade-4 | 5 |
| common-resources-and-avoiding-depletion-grade-1 | 5 |
| common-resources-and-avoiding-depletion-grade-2 | 5 |
| common-resources-and-avoiding-depletion-grade-3 | 5 |
| common-resources-and-avoiding-depletion-grade-4 | 5 |
| conflicting-sources-grade-1 | 5 |
| conflicting-sources-grade-2 | 5 |
| conflicting-sources-grade-3 | 5 |
| conflicting-sources-grade-4 | 5 |
| coordinates-and-constraint-based-location-grade-1 | 5 |
| coordinates-and-constraint-based-location-grade-2 | 5 |
| coordinates-and-constraint-based-location-grade-3 | 5 |
| coordinates-and-constraint-based-location-grade-4 | 5 |
| counterfactual-reasoning-grade-1 | 5 |
| counterfactual-reasoning-grade-2 | 5 |
| counterfactual-reasoning-grade-3 | 5 |
| counterfactual-reasoning-grade-4 | 5 |
| due-process-evidence-and-right-of-reply-grade-1 | 5 |
| due-process-evidence-and-right-of-reply-grade-2 | 5 |
| due-process-evidence-and-right-of-reply-grade-3 | 5 |
| due-process-evidence-and-right-of-reply-grade-4 | 5 |
| earth-sun-seasons-and-local-time-grade-1 | 5 |
| earth-sun-seasons-and-local-time-grade-2 | 5 |
| earth-sun-seasons-and-local-time-grade-3 | 5 |
| earth-sun-seasons-and-local-time-grade-4 | 5 |
| fairness-equal-proportional-and-need-based-grade-1 | 5 |
| fairness-equal-proportional-and-need-based-grade-2 | 5 |
| fairness-equal-proportional-and-need-based-grade-3 | 5 |
| fairness-equal-proportional-and-need-based-grade-4 | 5 |
| maps-legends-and-clues-grade-1 | 5 |
| maps-legends-and-clues-grade-2 | 5 |
| maps-legends-and-clues-grade-3 | 5 |
| maps-legends-and-clues-grade-4 | 5 |
| matching-scheduling-and-coverage-grade-1 | 5 |
| matching-scheduling-and-coverage-grade-2 | 5 |
| matching-scheduling-and-coverage-grade-3 | 5 |
| matching-scheduling-and-coverage-grade-4 | 5 |
| migration-and-population-balance-grade-1 | 5 |
| migration-and-population-balance-grade-2 | 5 |
| migration-and-population-balance-grade-3 | 5 |
| migration-and-population-balance-grade-4 | 5 |
| natural-risk-hazard-exposure-protection-grade-1 | 5 |
| natural-risk-hazard-exposure-protection-grade-2 | 5 |
| natural-risk-hazard-exposure-protection-grade-3 | 5 |
| natural-risk-hazard-exposure-protection-grade-4 | 5 |
| ordering-events-grade-1 | 5 |
| ordering-events-grade-2 | 5 |
| ordering-events-grade-3 | 5 |
| ordering-events-grade-4 | 5 |
| perspective-interest-and-source-credibility-grade-1 | 5 |
| perspective-interest-and-source-credibility-grade-2 | 5 |
| perspective-interest-and-source-credibility-grade-3 | 5 |
| perspective-interest-and-source-credibility-grade-4 | 5 |
| provenance-and-chain-of-custody-grade-1 | 5 |
| provenance-and-chain-of-custody-grade-2 | 5 |
| provenance-and-chain-of-custody-grade-3 | 5 |
| provenance-and-chain-of-custody-grade-4 | 5 |
| public-goods-and-common-contributions-grade-1 | 5 |
| public-goods-and-common-contributions-grade-2 | 5 |
| public-goods-and-common-contributions-grade-3 | 5 |
| public-goods-and-common-contributions-grade-4 | 5 |
| regions-sets-and-membership-grade-1 | 5 |
| regions-sets-and-membership-grade-2 | 5 |
| regions-sets-and-membership-grade-3 | 5 |
| regions-sets-and-membership-grade-4 | 5 |
| renewable-resources-and-sustainable-use-grade-1 | 5 |
| renewable-resources-and-sustainable-use-grade-2 | 5 |
| renewable-resources-and-sustainable-use-grade-3 | 5 |
| renewable-resources-and-sustainable-use-grade-4 | 5 |
| rights-as-limits-on-decisions-grade-1 | 5 |
| rights-as-limits-on-decisions-grade-2 | 5 |
| rights-as-limits-on-decisions-grade-3 | 5 |
| rights-as-limits-on-decisions-grade-4 | 5 |
| samples-surveys-and-public-opinion-grade-1 | 5 |
| samples-surveys-and-public-opinion-grade-2 | 5 |
| samples-surveys-and-public-opinion-grade-3 | 5 |
| samples-surveys-and-public-opinion-grade-4 | 5 |
| scale-proportion-and-distance-grade-1 | 5 |
| scale-proportion-and-distance-grade-2 | 5 |
| scale-proportion-and-distance-grade-3 | 5 |
| scale-proportion-and-distance-grade-4 | 5 |
| sources-and-supported-claims-grade-1 | 5 |
| sources-and-supported-claims-grade-2 | 5 |
| sources-and-supported-claims-grade-3 | 5 |
| sources-and-supported-claims-grade-4 | 5 |
| stocks-flows-and-conservation-grade-1 | 5 |
| stocks-flows-and-conservation-grade-2 | 5 |
| stocks-flows-and-conservation-grade-3 | 5 |
| stocks-flows-and-conservation-grade-4 | 5 |
| time-intervals-and-overlapping-events-grade-1 | 5 |
| time-intervals-and-overlapping-events-grade-2 | 5 |
| time-intervals-and-overlapping-events-grade-3 | 5 |
| time-intervals-and-overlapping-events-grade-4 | 5 |
| uncertain-data-intervals-and-limits-grade-1 | 5 |
| uncertain-data-intervals-and-limits-grade-2 | 5 |
| uncertain-data-intervals-and-limits-grade-3 | 5 |
| uncertain-data-intervals-and-limits-grade-4 | 5 |
| voting-majority-and-quorum-grade-1 | 5 |
| voting-majority-and-quorum-grade-2 | 5 |
| voting-majority-and-quorum-grade-3 | 5 |
| voting-majority-and-quorum-grade-4 | 5 |
| weighted-data-through-repetition | 2 |
| relative-position-from-two-relations | 2 |
| the-mean-changes-when-a-value-is-added | 1 |
| two-objects-with-the-same-code | 1 |
| a-deadline-two-working-days-later | 1 |
| a-truth-table-for-two-conditions | 1 |
| mean-from-a-frequency-table | 1 |
| same-mean-different-spread | 1 |
| three-consecutive-working-days | 1 |
| without-information-the-same-result-cannot-be-guaranteed | 1 |
| a-network-of-points-and-links | 1 |
| a-piece-that-cannot-fill-a-gap | 1 |
| a-two-question-classification-tree | 1 |
| alternative-route-after-a-failure | 1 |
| ambiguous-code-caused-by-a-prefix | 1 |
| binary-code-with-two-positions | 1 |
| center-by-maximum-distance | 1 |
| choose-the-question-that-splits-best | 1 |
| classification-into-three-non-overlapping-boxes | 1 |
| connected-network | 1 |
| critical-node-in-a-network | 1 |
| detecting-a-conclusion-that-is-too-strong | 1 |
| direction-in-a-one-way-network | 1 |
| distance-in-a-network | 1 |
| edge-trail-in-a-chain | 1 |
| evaluating-a-condition-on-every-state | 1 |
| minimize-cost-for-a-minimum-quantity | 1 |
| one-way-direction-that-blocks-the-return | 1 |
| parentheses-change-the-rule | 1 |
| plan-with-dependency-and-value | 1 |
| proving-that-two-formulas-give-the-same-result | 1 |
| scheduling-with-an-optional-task | 1 |
| shortest-path-by-number-of-links | 1 |
| simple-prefix-code-and-decoding-without-a-separator | 1 |
| three-activities-and-a-free-window | 1 |
| traverse-each-link-exactly-once | 1 |
| two-cycles-with-different-phases | 1 |
| two-separate-components | 1 |
| weighted-mean-defined-by-weights | 1 |

## Flagged bodies (summary)

The 3676 flagged bodies are summarized here: the 60 most
severe by tripped thresholds, then line count, then chain count. The complete per-body
list is printed to stdout by the tool.

| file | family | lines | loops | chains | variables | depth | tripped | suggestion |
|---|---|---|---|---|---|---|---|---|
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-001/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-002/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-003/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-004/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-005/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-006/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-007/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-008/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-009/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-010/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-011/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-012/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-013/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-014/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-015/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-016/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-017/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-018/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-019/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-020/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-021/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-022/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-023/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-024/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-025/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-026/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-027/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-028/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-029/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-030/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-031/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-032/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-033/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-034/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-035/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-036/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-037/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-038/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-039/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-deadline-feasibility/schedule-deadline-feasibility-instance-040/solution.sop` | schedule-deadline-feasibility | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-001/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-002/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-003/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-004/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-005/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-006/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-007/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-008/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-009/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-010/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-011/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-012/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-013/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-014/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-015/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-016/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-017/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-018/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-019/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |
| `/home/salboaie/work/sopLang-llm/training-data/procedural-arithmetic/no-knowledge/schedule-finish-time/schedule-finish-time-instance-020/solution.sop` | schedule-finish-time | 37 | 5 | 3 | 12 | 3 | lines+loops+variables | graphPath |

