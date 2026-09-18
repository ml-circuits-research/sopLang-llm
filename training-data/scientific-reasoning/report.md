# Dataset report

Source: `vision/1000_Scientific_Reasoning_Problems_Grades_1-4_EN.docx` (raw 1876946fbd5f22d1, canonical 24726758b984db44, extractor docx-canvas-text 1.1.0).

Accepted examples: 1000. Rejected candidates: 0. Evaluation holdout: 25 (2.5%). Distinct plans: 40. Distinct compiled circuits: 999 (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).

Acceptance class: every accepted example is `exact_verified` in the qualified sense defined by `DS008-training-data`: the executed circuit produced the printed answer, and the family computation reproduced it from the same reference parse. The independence that qualifies is stated under Limitations. An example whose printed answer the statement does not determine ships the computed answer instead and is `computed_verified`; it is listed under "Answers not shipped as printed".

Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.

## Accepted by category

- knowledge: 50
- no-knowledge: 950

## Accepted by problem type

knowledge/minimum-information-needed (25), knowledge/order-and-sequence (25), no-knowledge/causality-through-intervention-not-just-correlation (25),
no-knowledge/choice-under-multiple-conditions (25), no-knowledge/choosing-a-discriminating-experiment (25), no-knowledge/classification-by-multiple-rules (25),
no-knowledge/competing-hypotheses (25), no-knowledge/conservation-of-a-quantity (25), no-knowledge/counterexample-and-falsification-of-a-rule (25),
no-knowledge/counterfactual-reasoning (25), no-knowledge/detecting-a-contradiction (25), no-knowledge/diagnosis-from-clues (25), no-knowledge/discovering-a-rule-from-examples (25),
no-knowledge/dominance-and-multi-criteria-trade-offs (25), no-knowledge/elimination-by-clues (25), no-knowledge/error-deviation-and-reconciliation-of-measurements (25),
no-knowledge/exhaustive-case-analysis (25), no-knowledge/fair-test-and-control-variables (25), no-knowledge/if-then-logical-chain (25), no-knowledge/inferring-a-hidden-state (25),
no-knowledge/intervals-bounds-and-possibility (25), no-knowledge/is-the-evidence-sufficient (25), no-knowledge/minimum-intervention-in-a-system (25),
no-knowledge/multi-step-synthesis (25), no-knowledge/necessary-and-sufficient-conditions (25), no-knowledge/optimization-under-constraints (25),
no-knowledge/paths-in-a-network-with-constraints (25), no-knowledge/planning-with-partial-dependencies (25), no-knowledge/predicting-a-change (25),
no-knowledge/propagation-of-effects-through-a-network (25), no-knowledge/quantifiers-all-some-none (25), no-knowledge/rates-and-accumulation (25),
no-knowledge/reading-and-explaining-data (25), no-knowledge/repeated-processes-and-recurrence (25), no-knowledge/robust-decision-making-under-uncertainty (25),
no-knowledge/sets-intersections-and-differences (25), no-knowledge/simple-proportions-and-scaling (25), no-knowledge/spatial-relationships-and-orientation (25),
no-knowledge/structural-analogy-between-systems (25), no-knowledge/the-question-with-the-greatest-information-gain (25)


## Accepted by form

- form 1: 25
- form 2: 25
- form 3: 25
- form 4: 25
- form 5: 25
- form 6: 25
- form 7: 25
- form 8: 25
- form 9: 25
- form 10: 25
- form 11: 25
- form 12: 25
- form 13: 25
- form 14: 25
- form 15: 25
- form 16: 25
- form 17: 25
- form 18: 25
- form 19: 25
- form 20: 25
- form 21: 25
- form 22: 25
- form 23: 25
- form 24: 25
- form 25: 25
- form 26: 25
- form 27: 25
- form 28: 25
- form 29: 25
- form 30: 25
- form 31: 25
- form 32: 25
- form 33: 25
- form 34: 25
- form 35: 25
- form 36: 25
- form 37: 25
- form 38: 25
- form 39: 25
- form 40: 25

## Rejected by reason


## Answers not shipped as printed


13 accepted examples ship a computed answer because the statement does not determine the printed one; the printed answer stays in `explanation.md` as reference material and the class is `computed_verified`:
- no-knowledge/paths-in-a-network-with-constraints: 13 examples, printed answer alternative — the task admits several allowed routes of the same cheapest cost and the source prints one of them

## Family integrity checks

Templates covered: 40, of which 40 have several variants and 39 of those print several distinct answers, which is what shows that the computation reacts to its input.

Templates whose variants all print one answer, so the variants do not test recomputation:
- Quantifiers: all, some, none (25 variants, one printed answer)

## Text blemishes

The statement scan found no missing-space artifacts around digits.

## Limitations

- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.
- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.
- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.
- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.
- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.
