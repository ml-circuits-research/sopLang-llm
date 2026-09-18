# Dataset report

Source: `vision/Decompose_to_Solve_1000_Problems.docx` (raw 7ab64d39260d20e5, canonical 43457e916aabfb07, extractor docx-canvas-text 1.1.0).

Accepted examples: 1000. Rejected candidates: 0. Evaluation holdout: 100 (10.0%). Distinct plans: 10. Distinct compiled circuits: 1000 (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).

Acceptance class: every accepted example is `exact_verified` in the qualified sense defined by `DS008-training-data`: the executed circuit produced the printed answer, and the family computation reproduced it from the same reference parse. The independence that qualifies is stated under Limitations. An example whose printed answer the statement does not determine ships the computed answer instead and is `computed_verified`; it is listed under "Answers not shipped as printed".

Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.

## Accepted by category

- no-knowledge: 1000

## Accepted by problem type

no-knowledge/atomic-case-coupled-objective (100), no-knowledge/atomic-case-one-constraint-core (100), no-knowledge/competing-alternatives (100),
no-knowledge/dependency-chain-and-join (100), no-knowledge/evidence-tree-and-elimination (100), no-knowledge/network-routes-and-bottlenecks (100),
no-knowledge/normalization-and-capacity (100), no-knowledge/ten-part-integrated-decomposition (100), no-knowledge/two-step-minimal-split (100),
no-knowledge/uncertainty-and-robustness (100)


## Accepted by pattern

- pattern 1: 100
- pattern 2: 100
- pattern 3: 100
- pattern 4: 100
- pattern 5: 100
- pattern 6: 100
- pattern 7: 100
- pattern 8: 100
- pattern 9: 100
- pattern 10: 100

## Rejected by reason


## Answers not shipped as printed


100 accepted examples ship a computed answer because the statement does not determine the printed one; the printed answer stays in `explanation.md` as reference material and the class is `computed_verified`:
- no-knowledge/ten-part-integrated-decomposition: 100 examples, printed answer inconsistent — the statement prints the per-unit rate rounded to two decimals while the source computed the printed cost from an unrounded rate, so the printed cost agrees with the arithmetic the statement determines only inside the printed rate's rounding band.

## Family integrity checks

Templates covered: 10, of which 10 have several variants and 9 of those print several distinct answers, which is what shows that the computation reacts to its input.

Templates whose variants all print one answer, so the variants do not test recomputation:
- Evidence Tree and Elimination (100 variants, one printed answer)

## Text blemishes

The statement scan found no missing-space artifacts around digits.

## Limitations

- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.
- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.
- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.
- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.
- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.
