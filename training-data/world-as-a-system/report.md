# Dataset report

Source: `vision/World_as_a_System_1000_Reasoning_Problems_Grades_1-4_EN.docx` (raw d8c732e8a9fdfe53, canonical bb16f7d3017a292f, extractor docx-canvas-text 1.1.0).

Accepted examples: 1000. Rejected candidates: 0. Evaluation holdout: 20 (2.0%). Distinct plans: 50. Distinct compiled circuits: 988 (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).

Acceptance class: every accepted example is `exact_verified` in the qualified sense defined by `DS008-training-data`: the executed circuit produced the printed answer, and the family computation reproduced it from the same reference parse. The independence that qualifies is stated under Limitations. An example whose printed answer the statement does not determine ships the computed answer instead and is `computed_verified`; it is listed under "Answers not shipped as printed".

Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.

## Accepted by category

- no-knowledge: 1000

## Accepted by problem type

no-knowledge/anachronisms-and-temporal-compatibility-grade-1 (5), no-knowledge/anachronisms-and-temporal-compatibility-grade-2 (5),
no-knowledge/anachronisms-and-temporal-compatibility-grade-3 (5), no-knowledge/anachronisms-and-temporal-compatibility-grade-4 (5),
no-knowledge/causes-conditions-and-consequences-grade-1 (5), no-knowledge/causes-conditions-and-consequences-grade-2 (5),
no-knowledge/causes-conditions-and-consequences-grade-3 (5), no-knowledge/causes-conditions-and-consequences-grade-4 (5), no-knowledge/change-and-continuity-grade-1 (5),
no-knowledge/change-and-continuity-grade-2 (5), no-knowledge/change-and-continuity-grade-3 (5), no-knowledge/change-and-continuity-grade-4 (5),
no-knowledge/choosing-a-settlement-site-grade-1 (5), no-knowledge/choosing-a-settlement-site-grade-2 (5), no-knowledge/choosing-a-settlement-site-grade-3 (5),
no-knowledge/choosing-a-settlement-site-grade-4 (5), no-knowledge/climate-from-data-grade-1 (5), no-knowledge/climate-from-data-grade-2 (5),
no-knowledge/climate-from-data-grade-3 (5), no-knowledge/climate-from-data-grade-4 (5), no-knowledge/collective-choice-and-preferences-grade-1 (5),
no-knowledge/collective-choice-and-preferences-grade-2 (5), no-knowledge/collective-choice-and-preferences-grade-3 (5), no-knowledge/collective-choice-and-preferences-grade-4 (5),
no-knowledge/common-resources-and-avoiding-depletion-grade-1 (5), no-knowledge/common-resources-and-avoiding-depletion-grade-2 (5),
no-knowledge/common-resources-and-avoiding-depletion-grade-3 (5), no-knowledge/common-resources-and-avoiding-depletion-grade-4 (5), no-knowledge/conflicting-sources-grade-1 (5),
no-knowledge/conflicting-sources-grade-2 (5), no-knowledge/conflicting-sources-grade-3 (5), no-knowledge/conflicting-sources-grade-4 (5),
no-knowledge/coordinates-and-constraint-based-location-grade-1 (5), no-knowledge/coordinates-and-constraint-based-location-grade-2 (5),
no-knowledge/coordinates-and-constraint-based-location-grade-3 (5), no-knowledge/coordinates-and-constraint-based-location-grade-4 (5),
no-knowledge/counterfactual-reasoning-grade-1 (5), no-knowledge/counterfactual-reasoning-grade-2 (5), no-knowledge/counterfactual-reasoning-grade-3 (5),
no-knowledge/counterfactual-reasoning-grade-4 (5), no-knowledge/dates-durations-and-centuries-grade-1 (5), no-knowledge/dates-durations-and-centuries-grade-2 (5),
no-knowledge/dates-durations-and-centuries-grade-3 (5), no-knowledge/dates-durations-and-centuries-grade-4 (5), no-knowledge/density-capacity-and-crowding-grade-1 (5),
no-knowledge/density-capacity-and-crowding-grade-2 (5), no-knowledge/density-capacity-and-crowding-grade-3 (5), no-knowledge/density-capacity-and-crowding-grade-4 (5),
no-knowledge/due-process-evidence-and-right-of-reply-grade-1 (5), no-knowledge/due-process-evidence-and-right-of-reply-grade-2 (5),
no-knowledge/due-process-evidence-and-right-of-reply-grade-3 (5), no-knowledge/due-process-evidence-and-right-of-reply-grade-4 (5),
no-knowledge/earth-sun-seasons-and-local-time-grade-1 (5), no-knowledge/earth-sun-seasons-and-local-time-grade-2 (5), no-knowledge/earth-sun-seasons-and-local-time-grade-3 (5),
no-knowledge/earth-sun-seasons-and-local-time-grade-4 (5), no-knowledge/ecosystems-and-indirect-effects-grade-1 (5), no-knowledge/ecosystems-and-indirect-effects-grade-2 (5),
no-knowledge/ecosystems-and-indirect-effects-grade-3 (5), no-knowledge/ecosystems-and-indirect-effects-grade-4 (5), no-knowledge/exchange-routes-and-capacities-grade-1 (5),
no-knowledge/exchange-routes-and-capacities-grade-2 (5), no-knowledge/exchange-routes-and-capacities-grade-3 (5), no-knowledge/exchange-routes-and-capacities-grade-4 (5),
no-knowledge/fairness-equal-proportional-and-need-based-grade-1 (5), no-knowledge/fairness-equal-proportional-and-need-based-grade-2 (5),
no-knowledge/fairness-equal-proportional-and-need-based-grade-3 (5), no-knowledge/fairness-equal-proportional-and-need-based-grade-4 (5),
no-knowledge/genealogy-and-generations-grade-1 (5), no-knowledge/genealogy-and-generations-grade-2 (5), no-knowledge/genealogy-and-generations-grade-3 (5),
no-knowledge/genealogy-and-generations-grade-4 (5), no-knowledge/institutions-and-roles-grade-1 (5), no-knowledge/institutions-and-roles-grade-2 (5),
no-knowledge/institutions-and-roles-grade-3 (5), no-knowledge/institutions-and-roles-grade-4 (5), no-knowledge/land-use-and-spatial-compatibility-grade-1 (5),
no-knowledge/land-use-and-spatial-compatibility-grade-2 (5), no-knowledge/land-use-and-spatial-compatibility-grade-3 (5),
no-knowledge/land-use-and-spatial-compatibility-grade-4 (5), no-knowledge/layers-and-dating-objects-grade-1 (5), no-knowledge/layers-and-dating-objects-grade-2 (5),
no-knowledge/layers-and-dating-objects-grade-3 (5), no-knowledge/layers-and-dating-objects-grade-4 (5), no-knowledge/maps-legends-and-clues-grade-1 (5),
no-knowledge/maps-legends-and-clues-grade-2 (5), no-knowledge/maps-legends-and-clues-grade-3 (5), no-knowledge/maps-legends-and-clues-grade-4 (5),
no-knowledge/matching-scheduling-and-coverage-grade-1 (5), no-knowledge/matching-scheduling-and-coverage-grade-2 (5), no-knowledge/matching-scheduling-and-coverage-grade-3 (5),
no-knowledge/matching-scheduling-and-coverage-grade-4 (5), no-knowledge/meta-reasoning-robustness-information-causality-grade-1 (5),
no-knowledge/meta-reasoning-robustness-information-causality-grade-2 (5), no-knowledge/meta-reasoning-robustness-information-causality-grade-3 (5),
no-knowledge/meta-reasoning-robustness-information-causality-grade-4 (5), no-knowledge/migration-and-population-balance-grade-1 (5),
no-knowledge/migration-and-population-balance-grade-2 (5), no-knowledge/migration-and-population-balance-grade-3 (5), no-knowledge/migration-and-population-balance-grade-4 (5),
no-knowledge/natural-risk-hazard-exposure-protection-grade-1 (5), no-knowledge/natural-risk-hazard-exposure-protection-grade-2 (5),
no-knowledge/natural-risk-hazard-exposure-protection-grade-3 (5), no-knowledge/natural-risk-hazard-exposure-protection-grade-4 (5),
no-knowledge/negotiation-coalitions-and-agreement-grade-1 (5), no-knowledge/negotiation-coalitions-and-agreement-grade-2 (5),
no-knowledge/negotiation-coalitions-and-agreement-grade-3 (5), no-knowledge/negotiation-coalitions-and-agreement-grade-4 (5), no-knowledge/neighbours-and-borders-grade-1 (5),
no-knowledge/neighbours-and-borders-grade-2 (5), no-knowledge/neighbours-and-borders-grade-3 (5), no-knowledge/neighbours-and-borders-grade-4 (5),
no-knowledge/ordering-events-grade-1 (5), no-knowledge/ordering-events-grade-2 (5), no-knowledge/ordering-events-grade-3 (5), no-knowledge/ordering-events-grade-4 (5),
no-knowledge/perspective-interest-and-source-credibility-grade-1 (5), no-knowledge/perspective-interest-and-source-credibility-grade-2 (5),
no-knowledge/perspective-interest-and-source-credibility-grade-3 (5), no-knowledge/perspective-interest-and-source-credibility-grade-4 (5),
no-knowledge/positions-and-orientation-grade-1 (5), no-knowledge/positions-and-orientation-grade-2 (5), no-knowledge/positions-and-orientation-grade-3 (5),
no-knowledge/positions-and-orientation-grade-4 (5), no-knowledge/provenance-and-chain-of-custody-grade-1 (5), no-knowledge/provenance-and-chain-of-custody-grade-2 (5),
no-knowledge/provenance-and-chain-of-custody-grade-3 (5), no-knowledge/provenance-and-chain-of-custody-grade-4 (5), no-knowledge/public-budgets-and-priorities-grade-1 (5),
no-knowledge/public-budgets-and-priorities-grade-2 (5), no-knowledge/public-budgets-and-priorities-grade-3 (5), no-knowledge/public-budgets-and-priorities-grade-4 (5),
no-knowledge/public-goods-and-common-contributions-grade-1 (5), no-knowledge/public-goods-and-common-contributions-grade-2 (5),
no-knowledge/public-goods-and-common-contributions-grade-3 (5), no-knowledge/public-goods-and-common-contributions-grade-4 (5), no-knowledge/regions-sets-and-membership-grade-1 (5),
no-knowledge/regions-sets-and-membership-grade-2 (5), no-knowledge/regions-sets-and-membership-grade-3 (5), no-knowledge/regions-sets-and-membership-grade-4 (5),
no-knowledge/relief-and-movement-cost-grade-1 (5), no-knowledge/relief-and-movement-cost-grade-2 (5), no-knowledge/relief-and-movement-cost-grade-3 (5),
no-knowledge/relief-and-movement-cost-grade-4 (5), no-knowledge/renewable-resources-and-sustainable-use-grade-1 (5),
no-knowledge/renewable-resources-and-sustainable-use-grade-2 (5), no-knowledge/renewable-resources-and-sustainable-use-grade-3 (5),
no-knowledge/renewable-resources-and-sustainable-use-grade-4 (5), no-knowledge/representation-and-seats-grade-1 (5), no-knowledge/representation-and-seats-grade-2 (5),
no-knowledge/representation-and-seats-grade-3 (5), no-knowledge/representation-and-seats-grade-4 (5), no-knowledge/rights-as-limits-on-decisions-grade-1 (5),
no-knowledge/rights-as-limits-on-decisions-grade-2 (5), no-knowledge/rights-as-limits-on-decisions-grade-3 (5), no-knowledge/rights-as-limits-on-decisions-grade-4 (5),
no-knowledge/rivers-upstream-and-downstream-grade-1 (5), no-knowledge/rivers-upstream-and-downstream-grade-2 (5), no-knowledge/rivers-upstream-and-downstream-grade-3 (5),
no-knowledge/rivers-upstream-and-downstream-grade-4 (5), no-knowledge/roads-and-routes-grade-1 (5), no-knowledge/roads-and-routes-grade-2 (5),
no-knowledge/roads-and-routes-grade-3 (5), no-knowledge/roads-and-routes-grade-4 (5), no-knowledge/rules-and-exceptions-grade-1 (5), no-knowledge/rules-and-exceptions-grade-2 (5),
no-knowledge/rules-and-exceptions-grade-3 (5), no-knowledge/rules-and-exceptions-grade-4 (5), no-knowledge/samples-surveys-and-public-opinion-grade-1 (5),
no-knowledge/samples-surveys-and-public-opinion-grade-2 (5), no-knowledge/samples-surveys-and-public-opinion-grade-3 (5),
no-knowledge/samples-surveys-and-public-opinion-grade-4 (5), no-knowledge/scale-proportion-and-distance-grade-1 (5), no-knowledge/scale-proportion-and-distance-grade-2 (5),
no-knowledge/scale-proportion-and-distance-grade-3 (5), no-knowledge/scale-proportion-and-distance-grade-4 (5), no-knowledge/sources-and-supported-claims-grade-1 (5),
no-knowledge/sources-and-supported-claims-grade-2 (5), no-knowledge/sources-and-supported-claims-grade-3 (5), no-knowledge/sources-and-supported-claims-grade-4 (5),
no-knowledge/stocks-flows-and-conservation-grade-1 (5), no-knowledge/stocks-flows-and-conservation-grade-2 (5), no-knowledge/stocks-flows-and-conservation-grade-3 (5),
no-knowledge/stocks-flows-and-conservation-grade-4 (5), no-knowledge/time-intervals-and-overlapping-events-grade-1 (5),
no-knowledge/time-intervals-and-overlapping-events-grade-2 (5), no-knowledge/time-intervals-and-overlapping-events-grade-3 (5),
no-knowledge/time-intervals-and-overlapping-events-grade-4 (5), no-knowledge/travel-through-time-and-space-grade-1 (5), no-knowledge/travel-through-time-and-space-grade-2 (5),
no-knowledge/travel-through-time-and-space-grade-3 (5), no-knowledge/travel-through-time-and-space-grade-4 (5), no-knowledge/uncertain-data-intervals-and-limits-grade-1 (5),
no-knowledge/uncertain-data-intervals-and-limits-grade-2 (5), no-knowledge/uncertain-data-intervals-and-limits-grade-3 (5),
no-knowledge/uncertain-data-intervals-and-limits-grade-4 (5), no-knowledge/voting-majority-and-quorum-grade-1 (5), no-knowledge/voting-majority-and-quorum-grade-2 (5),
no-knowledge/voting-majority-and-quorum-grade-3 (5), no-knowledge/voting-majority-and-quorum-grade-4 (5)


## Accepted by family

- family C1: 20
- family C2: 20
- family C3: 20
- family C4: 20
- family C5: 20
- family C6: 20
- family C7: 20
- family G1: 20
- family G10: 20
- family G2: 20
- family G3: 20
- family G4: 20
- family G5: 20
- family G6: 20
- family G7: 20
- family G8: 20
- family G9: 20
- family H1: 20
- family H2: 20
- family H3: 20
- family H4: 20
- family H5: 20
- family H6: 20
- family H7: 20
- family H8: 20
- family N1: 20
- family N10: 20
- family N11: 20
- family N12: 20
- family N13: 20
- family N14: 20
- family N15: 20
- family N16: 20
- family N17: 20
- family N18: 20
- family N19: 20
- family N2: 20
- family N20: 20
- family N21: 20
- family N22: 20
- family N23: 20
- family N24: 20
- family N25: 20
- family N3: 20
- family N4: 20
- family N5: 20
- family N6: 20
- family N7: 20
- family N8: 20
- family N9: 20

## Accepted by grade

- grade 1: 250
- grade 2: 250
- grade 3: 250
- grade 4: 250

## Rejected by reason


## Answers not shipped as printed

Every accepted example ships the answer its source prints.

## Family integrity checks

Templates covered: 200, of which 200 have several variants and 187 of those print several distinct answers, which is what shows that the computation reacts to its input.

Templates whose variants all print one answer, so the variants do not test recomputation:
- Layers and dating objects (grade 1) (5 variants, one printed answer)
- Relief and movement cost (grade 1) (5 variants, one printed answer)
- Relief and movement cost (grade 2) (5 variants, one printed answer)
- Relief and movement cost (grade 3) (5 variants, one printed answer)
- Relief and movement cost (grade 4) (5 variants, one printed answer)
- Rights as limits on decisions (grade 1) (5 variants, one printed answer)
- Rights as limits on decisions (grade 2) (5 variants, one printed answer)
- Rights as limits on decisions (grade 3) (5 variants, one printed answer)
- Rights as limits on decisions (grade 4) (5 variants, one printed answer)
- Uncertain data, intervals, and limits (grade 1) (5 variants, one printed answer)
- Uncertain data, intervals, and limits (grade 2) (5 variants, one printed answer)
- Uncertain data, intervals, and limits (grade 3) (5 variants, one printed answer)
- Uncertain data, intervals, and limits (grade 4) (5 variants, one printed answer)

## Text blemishes

The statement scan found no missing-space artifacts around digits.

## Limitations

- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.
- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.
- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.
- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.
- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.
