# Dataset report

Source: `teacher/procedural/arithmetic.mjs` (generator arithmetic.mjs 1.3.0, seed 20260921, 40 instances per family).

Accepted examples: 3520. Rejected candidates: 0. Evaluation holdout: 480 (13.6%). Distinct plans: 88. Distinct compiled circuits: 3520 (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).

Acceptance class: every accepted example is `constructed_verified` as defined by `DS008-training-data`: the executed circuit produced the answer of the recorded latent plan, and the family oracle computed that answer by an independent route. The printed-answer signal of a book source does not exist for a generated instance, so the manifest rows record the generator, the family, the instance index, and the sampling seed instead of a source span.

Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.

## Accepted by category

- no-knowledge: 3520

## Accepted by problem type

no-knowledge/above-count (40), no-knowledge/above-count-double (40), no-knowledge/above-count-neighbour-add-rate (40), no-knowledge/above-count-neighbour-count (40),
no-knowledge/above-count-per-unit-add-rate (40), no-knowledge/above-divisible-probability (40), no-knowledge/above-largest-add-rate (40), no-knowledge/above-largest-double (40),
no-knowledge/above-largest-path-exists (40), no-knowledge/above-largest-per-unit-subtract-rate (40), no-knowledge/above-largest-square-area (40),
no-knowledge/above-second-largest (40), no-knowledge/above-smallest-double (40), no-knowledge/above-smallest-per-unit-add-rate (40), no-knowledge/above-third-largest-percent (40),
no-knowledge/above-total (40), no-knowledge/above-total-add-rate (40), no-knowledge/above-total-discount (40), no-knowledge/above-total-double-per-unit-add-rate (40),
no-knowledge/above-total-elapsed (40), no-knowledge/above-total-modulo (40), no-knowledge/above-total-modulo-add-rate (40), no-knowledge/above-total-per-unit-add-rate (40),
no-knowledge/above-total-percent (40), no-knowledge/above-total-percent-discount (40), no-knowledge/above-total-ratio (40), no-knowledge/above-total-rectangle-area (40),
no-knowledge/above-total-subtract-rate (40), no-knowledge/above-unique-count (40), no-knowledge/above-unique-count-percent (40), no-knowledge/average-of-qualifying (40),
no-knowledge/below-count (40), no-knowledge/below-count-elapsed-add-rate (40), no-knowledge/below-count-per-unit-add-rate (40), no-knowledge/below-count-rectangle-add-rate (40),
no-knowledge/below-largest-add-rate (40), no-knowledge/below-largest-double (40), no-knowledge/below-largest-path-exists (40),
no-knowledge/below-largest-per-unit-double-add-rate (40), no-knowledge/below-largest-rectangle-area (40), no-knowledge/below-total (40), no-knowledge/below-total-add-rate (40),
no-knowledge/below-total-double-subtract-rate (40), no-knowledge/below-total-elapsed (40), no-knowledge/below-total-per-unit-subtract-rate (40),
no-knowledge/cheaper-rate-per-unit (40), no-knowledge/conversion-chain-leftover (40), no-knowledge/count-letter-in-word (40), no-knowledge/count-self-referential-letter (40),
no-knowledge/crate-count-with-partial-last (40), no-knowledge/dependency-chain-join (40), no-knowledge/depletion-days-and-lead-time (40), no-knowledge/distinct-letters-in-word (40),
no-knowledge/elapsed-minutes (40), no-knowledge/evidence-tree-elimination (40), no-knowledge/filtered-records-above-a-threshold (40),
no-knowledge/filtered-records-at-least-a-threshold (40), no-knowledge/filtered-total (40), no-knowledge/first-and-last-letter (40), no-knowledge/grouped-label-totals (40),
no-knowledge/higher-best-of-two (40), no-knowledge/keep-below-total-ratio (40), no-knowledge/keep-divisible-count (40), no-knowledge/keep-divisible-total (40),
no-knowledge/keep-divisible-total-percent (40), no-knowledge/length-of-word (40), no-knowledge/length-ranked-words (40), no-knowledge/longer-of-two-words (40),
no-knowledge/minimal-winning-coalition (40), no-knowledge/net-balance-with-withdrawals (40), no-knowledge/parallel-join-deadline (40), no-knowledge/percent-of-total (40),
no-knowledge/raised-largest-record (40), no-knowledge/raised-smallest-record (40), no-knowledge/reverse-word (40), no-knowledge/route-bottleneck-capacity (40),
no-knowledge/route-summary-selection (40), no-knowledge/scaled-recipe (40), no-knowledge/schedule-deadline-feasibility (40), no-knowledge/schedule-finish-time (40),
no-knowledge/task-prerequisite-count (40), no-knowledge/top-k-among-list (40), no-knowledge/total-plus-a-fixed-amount (40), no-knowledge/total-plus-a-percentage (40),
no-knowledge/two-tier-price (40), no-knowledge/vowel-richest-word (40), no-knowledge/whole-units-under-a-budget (40), no-knowledge/words-containing-letter (40)


## Accepted by family

- family above-count: 40
- family above-count-double: 40
- family above-count-neighbour-add-rate: 40
- family above-count-neighbour-count: 40
- family above-count-per-unit-add-rate: 40
- family above-divisible-probability: 40
- family above-largest-add-rate: 40
- family above-largest-double: 40
- family above-largest-path-exists: 40
- family above-largest-per-unit-subtract-rate: 40
- family above-largest-square-area: 40
- family above-second-largest: 40
- family above-smallest-double: 40
- family above-smallest-per-unit-add-rate: 40
- family above-third-largest-percent: 40
- family above-total: 40
- family above-total-add-rate: 40
- family above-total-discount: 40
- family above-total-double-per-unit-add-rate: 40
- family above-total-elapsed: 40
- family above-total-modulo: 40
- family above-total-modulo-add-rate: 40
- family above-total-per-unit-add-rate: 40
- family above-total-percent: 40
- family above-total-percent-discount: 40
- family above-total-ratio: 40
- family above-total-rectangle-area: 40
- family above-total-subtract-rate: 40
- family above-unique-count: 40
- family above-unique-count-percent: 40
- family average-of-qualifying: 40
- family below-count: 40
- family below-count-elapsed-add-rate: 40
- family below-count-per-unit-add-rate: 40
- family below-count-rectangle-add-rate: 40
- family below-largest-add-rate: 40
- family below-largest-double: 40
- family below-largest-path-exists: 40
- family below-largest-per-unit-double-add-rate: 40
- family below-largest-rectangle-area: 40
- family below-total: 40
- family below-total-add-rate: 40
- family below-total-double-subtract-rate: 40
- family below-total-elapsed: 40
- family below-total-per-unit-subtract-rate: 40
- family cheaper-rate-per-unit: 40
- family conversion-chain-leftover: 40
- family count-letter-in-word: 40
- family count-self-referential-letter: 40
- family crate-count-with-partial-last: 40
- family dependency-chain-join: 40
- family depletion-days-and-lead-time: 40
- family distinct-letters-in-word: 40
- family elapsed-minutes: 40
- family evidence-tree-elimination: 40
- family filtered-records-above-a-threshold: 40
- family filtered-records-at-least-a-threshold: 40
- family filtered-total: 40
- family first-and-last-letter: 40
- family grouped-label-totals: 40
- family higher-best-of-two: 40
- family keep-below-total-ratio: 40
- family keep-divisible-count: 40
- family keep-divisible-total: 40
- family keep-divisible-total-percent: 40
- family length-of-word: 40
- family length-ranked-words: 40
- family longer-of-two-words: 40
- family minimal-winning-coalition: 40
- family net-balance-with-withdrawals: 40
- family parallel-join-deadline: 40
- family percent-of-total: 40
- family raised-largest-record: 40
- family raised-smallest-record: 40
- family reverse-word: 40
- family route-bottleneck-capacity: 40
- family route-summary-selection: 40
- family scaled-recipe: 40
- family schedule-deadline-feasibility: 40
- family schedule-finish-time: 40
- family task-prerequisite-count: 40
- family top-k-among-list: 40
- family total-plus-a-fixed-amount: 40
- family total-plus-a-percentage: 40
- family two-tier-price: 40
- family vowel-richest-word: 40
- family whole-units-under-a-budget: 40
- family words-containing-letter: 40

## Rejected by reason


## Answers not shipped as printed

Every accepted example ships the answer its source prints.

## Family integrity checks

Templates covered: 88, of which 88 have several variants and 88 of those print several distinct answers, which is what shows that the computation reacts to its input.

No template with several variants prints one answer for every variant.

## Text blemishes

The statement scan found no missing-space artifacts around digits.

## Limitations

- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.
- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.
- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.
- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.
- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.
