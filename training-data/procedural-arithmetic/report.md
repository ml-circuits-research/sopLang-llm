# Dataset report

Source: `teacher/procedural/arithmetic.mjs` (generator arithmetic.mjs 1.0.0, seed 20260921, 40 instances per family).

Accepted examples: 400. Rejected candidates: 0. Evaluation holdout: 40 (10.0%). Distinct plans: 10. Distinct compiled circuits: 400 (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).

Acceptance class: every accepted example is `constructed_verified` as defined by `DS008-training-data`: the executed circuit produced the answer of the recorded latent plan, and the family oracle computed that answer by an independent route. The printed-answer signal of a book source does not exist for a generated instance, so the manifest rows record the generator, the family, the instance index, and the sampling seed instead of a source span.

Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.

## Accepted by category

- no-knowledge: 400

## Accepted by problem type

no-knowledge/cheaper-rate-per-unit (40), no-knowledge/count-letter-in-word (40), no-knowledge/crate-count-with-partial-last (40), no-knowledge/depletion-days-and-lead-time (40),
no-knowledge/net-balance-with-withdrawals (40), no-knowledge/parallel-join-deadline (40), no-knowledge/reverse-word (40), no-knowledge/two-tier-price (40),
no-knowledge/whole-units-under-a-budget (40), no-knowledge/words-containing-letter (40)


## Accepted by family

- family cheaper-rate-per-unit: 40
- family count-letter-in-word: 40
- family crate-count-with-partial-last: 40
- family depletion-days-and-lead-time: 40
- family net-balance-with-withdrawals: 40
- family parallel-join-deadline: 40
- family reverse-word: 40
- family two-tier-price: 40
- family whole-units-under-a-budget: 40
- family words-containing-letter: 40

## Rejected by reason


## Answers not shipped as printed

Every accepted example ships the answer its source prints.

## Family integrity checks

Templates covered: 10, of which 10 have several variants and 10 of those print several distinct answers, which is what shows that the computation reacts to its input.

No template with several variants prints one answer for every variant.

## Text blemishes

The statement scan found no missing-space artifacts around digits.

## Limitations

- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.
- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.
- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.
- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.
- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.
