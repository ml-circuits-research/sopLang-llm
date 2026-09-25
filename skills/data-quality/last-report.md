# data-quality: jsEval body complexity scan

Run: 2026-09-25T13:56:18.205Z

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
- the bloat indicator: **2.19** wires per plan against **15.4** jsEval lines per plan (7.0 lines per wire); **1468** plans carry `<= 3 wires but > 25 jsEval lines` — too few wires for the JavaScript mass
- jsEval bodies scanned: **11760**
- bodies flagged MONSTROUS: **4397** (37.4% of bodies)
- files with a flagged body: **4397** (41.3% of files)
- wire-discovery top shapes available for candidate matching: **20**
- wire-discovery top shapes still present in the current dataset: **1** (80 bodies)

## Per-metric trips

A body may exceed several thresholds; each row counts bodies that trip that one metric.

| metric | threshold | bodies | share of all bodies |
|---|---|---|---|
| lines | `> 15` | 3676 | 31.3% |
| loops | `> 2` | 774 | 6.6% |
| chains | `> 3` | 947 | 8.1% |
| variables | `> 6` | 3922 | 33.4% |
| depth | `> 3` | 207 | 1.8% |

## Thresholds tripped per flagged body

| tripped | bodies | share of flagged |
|---|---|---|
| 1 | 793 | 18.0% |
| 2 | 2396 | 54.5% |
| 3 | 891 | 20.3% |
| 4 | 317 | 7.2% |

## Suggestion distribution

| suggestion | bodies | share of flagged |
|---|---|---|
| container | 2890 | 65.7% |
| aggregate | 1093 | 24.9% |
| fraction | 212 | 4.8% |
| graphPath | 202 | 4.6% |
| candidate | 0 | 0.0% |

`candidate` matches a body's normalized shape against the top shapes in the current
wire-discovery report. A zero here means none of the flagged bodies is one of those
top shapes — usually because the wire-discovery report predates the last rebuild
(its measured shapes no longer occur verbatim, or the surviving shapes map to an
existing wire such as `graphPath`). Re-run wire-discovery, then re-run this tool, and
the candidate bucket repopulates.

## Flagged bodies by family

- affected families: **380**

| family | flagged bodies |
|---|---|
| atomic-case-coupled-objective | 100 |
| competing-alternatives | 100 |
| evidence-tree-and-elimination | 100 |
| network-routes-and-bottlenecks | 100 |
| ten-part-integrated-decomposition | 100 |
| uncertainty-and-robustness | 100 |
| units-and-rates | 50 |
| base-rates | 50 |
| bottlenecks | 50 |
| break-even-threshold | 50 |
| budget-and-constraints | 50 |
| chained-yields | 50 |
| data-consistency | 50 |
| expected-value-and-risk | 50 |
| logical-implications | 50 |
| marginal-allocation | 50 |
| mean-versus-median | 50 |
| measurement-uncertainty | 50 |
| multi-criteria-decision | 50 |
| robustness | 50 |
| successive-percentage-changes | 50 |
| time-dependencies | 50 |
| weighted-averages | 50 |
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
| competing-hypotheses | 25 |
| conservation-of-a-quantity | 25 |
| counterfactual-reasoning | 25 |
| discovering-a-rule-from-examples | 25 |
| dominance-and-multi-criteria-trade-offs | 25 |
| error-deviation-and-reconciliation-of-measurements | 25 |
| exhaustive-case-analysis | 25 |
| minimum-intervention-in-a-system | 25 |
| optimization-under-constraints | 25 |
| paths-in-a-network-with-constraints | 25 |
| planning-with-partial-dependencies | 25 |
| predicting-a-change | 25 |
| propagation-of-effects-through-a-network | 25 |
| quantifiers-all-some-none | 25 |
| reading-and-explaining-data | 25 |
| repeated-processes-and-recurrence | 25 |
| robust-decision-making-under-uncertainty | 25 |
| sets-intersections-and-differences | 25 |
| spatial-relationships-and-orientation | 25 |
| structural-analogy-between-systems | 25 |
| the-question-with-the-greatest-information-gain | 25 |
| a-public-counters-opening-hours | 10 |
| a-synthesis-from-several-fragments | 10 |
| an-extract-from-an-employment-contract | 10 |
| bus-and-train-timetables | 10 |
| calendars-deadlines-and-working-days | 10 |
| charts-told-in-prose | 10 |
| comparing-two-or-three-offers | 10 |
| contracts-and-plain-clauses | 10 |
| density-weight-and-floating | 10 |
| food-chains-in-a-described-ecosystem | 10 |
| frequency-chance-and-expected-number | 10 |
| hours-breaks-and-overtime | 10 |
| indoor-temperature-and-insulation | 10 |
| internal-rules-and-sanctions | 10 |
| letters-messages-and-addressees | 10 |
| maps-and-legends-described | 10 |
| networks-bandwidth-and-waiting | 10 |
| news-headline-and-body | 10 |
| nutrition-labels | 10 |
| opportunity-cost | 10 |
| public-signs-described-in-words | 10 |
| sleep-rest-and-daily-rhythm | 10 |
| sound-distance-and-obstacles | 10 |
| source-claim-and-evidence | 10 |
| speed-duration-and-distance | 10 |
| time-zones-from-a-given-table | 10 |
| timelines-and-chained-causes | 10 |
| urgent-versus-important | 10 |
| volumes-containers-and-mixtures | 10 |
| water-effort-and-temperature | 10 |
| absolute-change-and-relative-change | 10 |
| from-sample-toward-a-class | 10 |
| if-when-whenever | 10 |
| small-choices-and-average-return | 10 |
| timeline | 5 |
| choose-the-correct-instruction | 5 |
| coins-with-given-values | 5 |
| largest-allowed-numerical-code | 5 |
| maximum-minimum-and-ties | 5 |
| number-from-allowed-digits | 5 |
| order-in-a-line | 5 |
| scheduling-four-tasks | 5 |
| shortest-path-in-a-state-space | 5 |
| three-digit-code-and-positional-clues | 5 |
| who-has-the-longest-object | 5 |
| negotiation-coalitions-and-agreement-grade-1 | 5 |
| negotiation-coalitions-and-agreement-grade-2 | 5 |
| negotiation-coalitions-and-agreement-grade-3 | 5 |
| negotiation-coalitions-and-agreement-grade-4 | 5 |
| anachronisms-and-temporal-compatibility-grade-1 | 5 |
| anachronisms-and-temporal-compatibility-grade-2 | 5 |
| anachronisms-and-temporal-compatibility-grade-3 | 5 |
| anachronisms-and-temporal-compatibility-grade-4 | 5 |
| causes-conditions-and-consequences-grade-1 | 5 |
| causes-conditions-and-consequences-grade-2 | 5 |
| causes-conditions-and-consequences-grade-3 | 5 |
| causes-conditions-and-consequences-grade-4 | 5 |
| change-and-continuity-grade-1 | 5 |
| change-and-continuity-grade-2 | 5 |
| change-and-continuity-grade-3 | 5 |
| change-and-continuity-grade-4 | 5 |
| choosing-a-settlement-site-grade-1 | 5 |
| choosing-a-settlement-site-grade-2 | 5 |
| choosing-a-settlement-site-grade-3 | 5 |
| choosing-a-settlement-site-grade-4 | 5 |
| climate-from-data-grade-1 | 5 |
| climate-from-data-grade-2 | 5 |
| climate-from-data-grade-3 | 5 |
| climate-from-data-grade-4 | 5 |
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
| dates-durations-and-centuries-grade-1 | 5 |
| dates-durations-and-centuries-grade-2 | 5 |
| dates-durations-and-centuries-grade-3 | 5 |
| dates-durations-and-centuries-grade-4 | 5 |
| density-capacity-and-crowding-grade-1 | 5 |
| density-capacity-and-crowding-grade-2 | 5 |
| density-capacity-and-crowding-grade-3 | 5 |
| density-capacity-and-crowding-grade-4 | 5 |
| due-process-evidence-and-right-of-reply-grade-1 | 5 |
| due-process-evidence-and-right-of-reply-grade-2 | 5 |
| due-process-evidence-and-right-of-reply-grade-3 | 5 |
| due-process-evidence-and-right-of-reply-grade-4 | 5 |
| earth-sun-seasons-and-local-time-grade-1 | 5 |
| earth-sun-seasons-and-local-time-grade-2 | 5 |
| earth-sun-seasons-and-local-time-grade-3 | 5 |
| earth-sun-seasons-and-local-time-grade-4 | 5 |
| ecosystems-and-indirect-effects-grade-1 | 5 |
| ecosystems-and-indirect-effects-grade-2 | 5 |
| ecosystems-and-indirect-effects-grade-3 | 5 |
| ecosystems-and-indirect-effects-grade-4 | 5 |
| exchange-routes-and-capacities-grade-1 | 5 |
| exchange-routes-and-capacities-grade-2 | 5 |
| exchange-routes-and-capacities-grade-3 | 5 |
| exchange-routes-and-capacities-grade-4 | 5 |
| fairness-equal-proportional-and-need-based-grade-1 | 5 |
| fairness-equal-proportional-and-need-based-grade-2 | 5 |
| fairness-equal-proportional-and-need-based-grade-3 | 5 |
| fairness-equal-proportional-and-need-based-grade-4 | 5 |
| genealogy-and-generations-grade-1 | 5 |
| genealogy-and-generations-grade-2 | 5 |
| genealogy-and-generations-grade-3 | 5 |
| genealogy-and-generations-grade-4 | 5 |
| institutions-and-roles-grade-1 | 5 |
| institutions-and-roles-grade-2 | 5 |
| institutions-and-roles-grade-3 | 5 |
| institutions-and-roles-grade-4 | 5 |
| land-use-and-spatial-compatibility-grade-1 | 5 |
| land-use-and-spatial-compatibility-grade-2 | 5 |
| land-use-and-spatial-compatibility-grade-3 | 5 |
| land-use-and-spatial-compatibility-grade-4 | 5 |
| layers-and-dating-objects-grade-1 | 5 |
| layers-and-dating-objects-grade-2 | 5 |
| layers-and-dating-objects-grade-3 | 5 |
| layers-and-dating-objects-grade-4 | 5 |
| maps-legends-and-clues-grade-1 | 5 |
| maps-legends-and-clues-grade-2 | 5 |
| maps-legends-and-clues-grade-3 | 5 |
| maps-legends-and-clues-grade-4 | 5 |
| matching-scheduling-and-coverage-grade-1 | 5 |
| matching-scheduling-and-coverage-grade-2 | 5 |
| matching-scheduling-and-coverage-grade-3 | 5 |
| matching-scheduling-and-coverage-grade-4 | 5 |
| meta-reasoning-robustness-information-causality-grade-1 | 5 |
| meta-reasoning-robustness-information-causality-grade-2 | 5 |
| meta-reasoning-robustness-information-causality-grade-3 | 5 |
| meta-reasoning-robustness-information-causality-grade-4 | 5 |
| migration-and-population-balance-grade-1 | 5 |
| migration-and-population-balance-grade-2 | 5 |
| migration-and-population-balance-grade-3 | 5 |
| migration-and-population-balance-grade-4 | 5 |
| natural-risk-hazard-exposure-protection-grade-1 | 5 |
| natural-risk-hazard-exposure-protection-grade-2 | 5 |
| natural-risk-hazard-exposure-protection-grade-3 | 5 |
| natural-risk-hazard-exposure-protection-grade-4 | 5 |
| neighbours-and-borders-grade-1 | 5 |
| neighbours-and-borders-grade-2 | 5 |
| neighbours-and-borders-grade-3 | 5 |
| neighbours-and-borders-grade-4 | 5 |
| ordering-events-grade-1 | 5 |
| ordering-events-grade-2 | 5 |
| ordering-events-grade-3 | 5 |
| ordering-events-grade-4 | 5 |
| perspective-interest-and-source-credibility-grade-1 | 5 |
| perspective-interest-and-source-credibility-grade-2 | 5 |
| perspective-interest-and-source-credibility-grade-3 | 5 |
| perspective-interest-and-source-credibility-grade-4 | 5 |
| positions-and-orientation-grade-1 | 5 |
| positions-and-orientation-grade-2 | 5 |
| positions-and-orientation-grade-3 | 5 |
| positions-and-orientation-grade-4 | 5 |
| provenance-and-chain-of-custody-grade-1 | 5 |
| provenance-and-chain-of-custody-grade-2 | 5 |
| provenance-and-chain-of-custody-grade-3 | 5 |
| provenance-and-chain-of-custody-grade-4 | 5 |
| public-budgets-and-priorities-grade-1 | 5 |
| public-budgets-and-priorities-grade-2 | 5 |
| public-budgets-and-priorities-grade-3 | 5 |
| public-budgets-and-priorities-grade-4 | 5 |
| public-goods-and-common-contributions-grade-1 | 5 |
| public-goods-and-common-contributions-grade-2 | 5 |
| public-goods-and-common-contributions-grade-3 | 5 |
| public-goods-and-common-contributions-grade-4 | 5 |
| regions-sets-and-membership-grade-1 | 5 |
| regions-sets-and-membership-grade-2 | 5 |
| regions-sets-and-membership-grade-3 | 5 |
| regions-sets-and-membership-grade-4 | 5 |
| relief-and-movement-cost-grade-1 | 5 |
| relief-and-movement-cost-grade-2 | 5 |
| relief-and-movement-cost-grade-3 | 5 |
| relief-and-movement-cost-grade-4 | 5 |
| renewable-resources-and-sustainable-use-grade-1 | 5 |
| renewable-resources-and-sustainable-use-grade-2 | 5 |
| renewable-resources-and-sustainable-use-grade-3 | 5 |
| renewable-resources-and-sustainable-use-grade-4 | 5 |
| representation-and-seats-grade-1 | 5 |
| representation-and-seats-grade-2 | 5 |
| representation-and-seats-grade-3 | 5 |
| representation-and-seats-grade-4 | 5 |
| rights-as-limits-on-decisions-grade-1 | 5 |
| rights-as-limits-on-decisions-grade-2 | 5 |
| rights-as-limits-on-decisions-grade-3 | 5 |
| rights-as-limits-on-decisions-grade-4 | 5 |
| rivers-upstream-and-downstream-grade-1 | 5 |
| rivers-upstream-and-downstream-grade-2 | 5 |
| rivers-upstream-and-downstream-grade-3 | 5 |
| rivers-upstream-and-downstream-grade-4 | 5 |
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
| the-mean-changes-when-a-value-is-added | 1 |
| two-objects-with-the-same-code | 1 |
| a-deadline-two-working-days-later | 1 |
| a-truth-table-for-two-conditions | 1 |
| exactly-one-success | 1 |
| mean-from-a-frequency-table | 1 |
| probability-zero-after-new-information | 1 |
| same-mean-different-spread | 1 |
| three-consecutive-working-days | 1 |
| two-answers-that-identify-an-object | 1 |
| weighted-data-through-repetition | 1 |
| without-information-the-same-result-cannot-be-guaranteed | 1 |
| a-certain-answer-without-knowing-the-exact-object | 1 |
| a-certain-event | 1 |
| a-clue-that-changes-nothing | 1 |
| a-clue-whose-usefulness-depends-on-another-clue | 1 |
| a-conclusion-that-does-not-follow-from-the-data | 1 |
| a-message-with-extra-information | 1 |
| a-negative-clue-can-be-stronger | 1 |
| a-network-of-points-and-links | 1 |
| a-piece-that-cannot-fill-a-gap | 1 |
| a-property-that-is-possible-but-not-certain | 1 |
| a-two-bit-code-in-child-friendly-language | 1 |
| a-two-question-classification-tree | 1 |
| alternative-route-after-a-failure | 1 |
| ambiguous-code-caused-by-a-prefix | 1 |
| an-incomplete-message-with-multiple-interpretations | 1 |
| binary-code-with-two-positions | 1 |
| center-by-maximum-distance | 1 |
| choose-the-question-that-splits-best | 1 |
| choosing-a-pair-with-an-incompatibility | 1 |
| classification-into-three-non-overlapping-boxes | 1 |
| connected-network | 1 |
| contradictory-clues | 1 |
| cost-on-links | 1 |
| critical-node-in-a-network | 1 |
| detecting-a-conclusion-that-is-too-strong | 1 |
| direct-link-versus-indirect-path | 1 |
| direction-in-a-one-way-network | 1 |
| distance-in-a-network | 1 |
| drawing-with-replacement-the-composition-remains | 1 |
| drawing-without-replacement-the-second-chance-changes | 1 |
| edge-trail-in-a-chain | 1 |
| evaluating-a-condition-on-every-state | 1 |
| exactly-one-statement-is-true | 1 |
| exactly-two-statements-are-true | 1 |
| information-from-the-absence-of-a-result | 1 |
| information-that-completes-a-non-unique-puzzle | 1 |
| maximize-value-under-a-capacity-limit | 1 |
| minimize-cost-for-a-minimum-quantity | 1 |
| minimize-waiting-for-the-earliest-tasks | 1 |
| minimum-number-of-questions-for-four-possibilities | 1 |
| one-way-direction-that-blocks-the-return | 1 |
| parentheses-change-the-rule | 1 |
| path-blocked-after-removing-an-edge | 1 |
| plan-with-dependency-and-value | 1 |
| possible-sums-not-possible-outcomes | 1 |
| probability-of-an-even-number | 1 |
| proving-that-two-formulas-give-the-same-result | 1 |
| relative-position-from-two-relations | 1 |
| scheduling-with-an-optional-task | 1 |
| shortest-path-by-number-of-links | 1 |
| simple-prefix-code-and-decoding-without-a-separator | 1 |
| the-additional-question-that-is-needed | 1 |
| the-order-of-clues-and-the-same-solution | 1 |
| the-question-that-halves-the-possibilities | 1 |
| the-second-test-becomes-decisive | 1 |
| the-smallest-amount-of-information-that-solves-the-puzzle | 1 |
| three-activities-and-a-free-window | 1 |
| traverse-each-link-exactly-once | 1 |
| two-cycles-with-different-phases | 1 |
| two-different-routes-the-same-destination | 1 |
| two-separate-components | 1 |
| visit-all-nodes-without-repetition | 1 |
| weighted-mean-defined-by-weights | 1 |
| when-the-information-is-not-sufficient | 1 |
| when-two-clues-say-the-same-thing | 1 |

## Flagged bodies (summary)

The 4397 flagged bodies are summarized here: the 60 most
severe by tripped thresholds, then line count, then chain count. The complete per-body
list is printed to stdout by the tool.

| file | family | lines | loops | chains | variables | depth | tripped | suggestion |
|---|---|---|---|---|---|---|---|---|
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-1/181-reasoning-across-generations-case-1/solution.sop` | genealogy-and-generations-grade-1 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-1/182-reasoning-across-generations-case-2/solution.sop` | genealogy-and-generations-grade-1 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-1/183-reasoning-across-generations-case-3/solution.sop` | genealogy-and-generations-grade-1 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-1/184-reasoning-across-generations-case-4/solution.sop` | genealogy-and-generations-grade-1 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-1/185-reasoning-across-generations-case-5/solution.sop` | genealogy-and-generations-grade-1 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-2/431-reasoning-across-generations-case-1/solution.sop` | genealogy-and-generations-grade-2 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-2/432-reasoning-across-generations-case-2/solution.sop` | genealogy-and-generations-grade-2 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-2/433-reasoning-across-generations-case-3/solution.sop` | genealogy-and-generations-grade-2 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-2/434-reasoning-across-generations-case-4/solution.sop` | genealogy-and-generations-grade-2 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-2/435-reasoning-across-generations-case-5/solution.sop` | genealogy-and-generations-grade-2 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-3/681-reasoning-across-generations-case-1/solution.sop` | genealogy-and-generations-grade-3 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-3/682-reasoning-across-generations-case-2/solution.sop` | genealogy-and-generations-grade-3 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-3/683-reasoning-across-generations-case-3/solution.sop` | genealogy-and-generations-grade-3 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-3/684-reasoning-across-generations-case-4/solution.sop` | genealogy-and-generations-grade-3 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-3/685-reasoning-across-generations-case-5/solution.sop` | genealogy-and-generations-grade-3 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-4/931-reasoning-across-generations-case-1/solution.sop` | genealogy-and-generations-grade-4 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-4/932-reasoning-across-generations-case-2/solution.sop` | genealogy-and-generations-grade-4 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-4/933-reasoning-across-generations-case-3/solution.sop` | genealogy-and-generations-grade-4 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-4/934-reasoning-across-generations-case-4/solution.sop` | genealogy-and-generations-grade-4 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/genealogy-and-generations-grade-4/935-reasoning-across-generations-case-5/solution.sop` | genealogy-and-generations-grade-4 | 93 | 7 | 1 | 28 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-1/246-meta-reasoning-case-1/solution.sop` | meta-reasoning-robustness-information-causality-grade-1 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-1/247-meta-reasoning-case-2/solution.sop` | meta-reasoning-robustness-information-causality-grade-1 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-1/248-meta-reasoning-case-3/solution.sop` | meta-reasoning-robustness-information-causality-grade-1 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-1/249-meta-reasoning-case-4/solution.sop` | meta-reasoning-robustness-information-causality-grade-1 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-1/250-meta-reasoning-case-5/solution.sop` | meta-reasoning-robustness-information-causality-grade-1 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/496-meta-reasoning-case-1/solution.sop` | meta-reasoning-robustness-information-causality-grade-2 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/497-meta-reasoning-case-2/solution.sop` | meta-reasoning-robustness-information-causality-grade-2 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/498-meta-reasoning-case-3/solution.sop` | meta-reasoning-robustness-information-causality-grade-2 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/499-meta-reasoning-case-4/solution.sop` | meta-reasoning-robustness-information-causality-grade-2 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-2/500-meta-reasoning-case-5/solution.sop` | meta-reasoning-robustness-information-causality-grade-2 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-3/746-meta-reasoning-case-1/solution.sop` | meta-reasoning-robustness-information-causality-grade-3 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-3/747-meta-reasoning-case-2/solution.sop` | meta-reasoning-robustness-information-causality-grade-3 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-3/748-meta-reasoning-case-3/solution.sop` | meta-reasoning-robustness-information-causality-grade-3 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-3/749-meta-reasoning-case-4/solution.sop` | meta-reasoning-robustness-information-causality-grade-3 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-3/750-meta-reasoning-case-5/solution.sop` | meta-reasoning-robustness-information-causality-grade-3 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/1000-meta-reasoning-case-5/solution.sop` | meta-reasoning-robustness-information-causality-grade-4 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/996-meta-reasoning-case-1/solution.sop` | meta-reasoning-robustness-information-causality-grade-4 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/997-meta-reasoning-case-2/solution.sop` | meta-reasoning-robustness-information-causality-grade-4 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/998-meta-reasoning-case-3/solution.sop` | meta-reasoning-robustness-information-causality-grade-4 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/meta-reasoning-robustness-information-causality-grade-4/999-meta-reasoning-case-4/solution.sop` | meta-reasoning-robustness-information-causality-grade-4 | 86 | 3 | 1 | 29 | 4 | lines+loops+variables+depth | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-1/71-cause-and-consequence-chain-case-1/solution.sop` | causes-conditions-and-consequences-grade-1 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-1/72-cause-and-consequence-chain-case-2/solution.sop` | causes-conditions-and-consequences-grade-1 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-1/73-cause-and-consequence-chain-case-3/solution.sop` | causes-conditions-and-consequences-grade-1 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-1/74-cause-and-consequence-chain-case-4/solution.sop` | causes-conditions-and-consequences-grade-1 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-1/75-cause-and-consequence-chain-case-5/solution.sop` | causes-conditions-and-consequences-grade-1 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/321-cause-and-consequence-chain-case-1/solution.sop` | causes-conditions-and-consequences-grade-2 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/322-cause-and-consequence-chain-case-2/solution.sop` | causes-conditions-and-consequences-grade-2 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/323-cause-and-consequence-chain-case-3/solution.sop` | causes-conditions-and-consequences-grade-2 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/324-cause-and-consequence-chain-case-4/solution.sop` | causes-conditions-and-consequences-grade-2 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-2/325-cause-and-consequence-chain-case-5/solution.sop` | causes-conditions-and-consequences-grade-2 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/571-cause-and-consequence-chain-case-1/solution.sop` | causes-conditions-and-consequences-grade-3 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/572-cause-and-consequence-chain-case-2/solution.sop` | causes-conditions-and-consequences-grade-3 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/573-cause-and-consequence-chain-case-3/solution.sop` | causes-conditions-and-consequences-grade-3 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/574-cause-and-consequence-chain-case-4/solution.sop` | causes-conditions-and-consequences-grade-3 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-3/575-cause-and-consequence-chain-case-5/solution.sop` | causes-conditions-and-consequences-grade-3 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/821-cause-and-consequence-chain-case-1/solution.sop` | causes-conditions-and-consequences-grade-4 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/822-cause-and-consequence-chain-case-2/solution.sop` | causes-conditions-and-consequences-grade-4 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/823-cause-and-consequence-chain-case-3/solution.sop` | causes-conditions-and-consequences-grade-4 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/824-cause-and-consequence-chain-case-4/solution.sop` | causes-conditions-and-consequences-grade-4 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |
| `/home/salboaie/work/sopLang-llm/training-data/world-as-a-system/no-knowledge/causes-conditions-and-consequences-grade-4/825-cause-and-consequence-chain-case-5/solution.sop` | causes-conditions-and-consequences-grade-4 | 81 | 3 | 16 | 30 | 3 | lines+loops+chains+variables | container |

