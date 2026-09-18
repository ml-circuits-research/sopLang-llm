# Dataset report

Source: `vision/Common_Sense_for_Adults_1000_Problems.docx` (raw e3568f13d248dd9e, canonical 34ab58676c4f3a3b, extractor docx-canvas-text 1.1.0).

Accepted examples: 1000. Rejected candidates: 0. Evaluation holdout: 50 (5.0%). Distinct plans: 20. Distinct compiled circuits: 864 (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).

Acceptance class: every accepted example is `exact_verified` in the qualified sense defined by `DS008-training-data`: the executed circuit produced the printed answer, and the family computation reproduced it from the same reference parse. The independence that qualifies is stated under Limitations. An example whose printed answer the statement does not determine ships the computed answer instead and is `computed_verified`; it is listed under "Answers not shipped as printed".

Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.

## Accepted by category

- no-knowledge: 1000

## Accepted by problem type

no-knowledge/base-rates (50), no-knowledge/bottlenecks (50), no-knowledge/break-even-threshold (50), no-knowledge/budget-and-constraints (50), no-knowledge/causality (50),
no-knowledge/chained-yields (50), no-knowledge/data-consistency (50), no-knowledge/expected-value-and-risk (50), no-knowledge/integer-capacity-threshold (50),
no-knowledge/logical-implications (50), no-knowledge/marginal-allocation (50), no-knowledge/mean-versus-median (50), no-knowledge/measurement-uncertainty (50),
no-knowledge/multi-criteria-decision (50), no-knowledge/robustness (50), no-knowledge/sampling (50), no-knowledge/successive-percentage-changes (50),
no-knowledge/time-dependencies (50), no-knowledge/units-and-rates (50), no-knowledge/weighted-averages (50)


## Accepted by template

- template 1: 50
- template 2: 50
- template 3: 50
- template 4: 50
- template 5: 50
- template 6: 50
- template 7: 50
- template 8: 50
- template 9: 50
- template 10: 50
- template 11: 50
- template 12: 50
- template 13: 50
- template 14: 50
- template 15: 50
- template 16: 50
- template 17: 50
- template 18: 50
- template 19: 50
- template 20: 50

## Rejected by reason


## Answers not shipped as printed

Every accepted example ships the answer its source prints.

## Family integrity checks

Templates covered: 20, of which 20 have several variants and 17 of those print several distinct answers, which is what shows that the computation reacts to its input.

Templates whose variants all print one answer, so the variants do not test recomputation:
- Causality (50 variants, one printed answer)
- Logical implications (50 variants, one printed answer)
- Sampling (50 variants, one printed answer)

## Text blemishes

The statement scan found no missing-space artifacts around digits.

## Limitations

- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.
- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.
- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.
- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.
- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.
