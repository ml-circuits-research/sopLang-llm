# Dataset report

Source: `vision/Logical_Reasoning_Types_Course.docx` (raw 930746ccd3275abc, canonical 319c4c96e6346df3, extractor docx-canvas-text 1.1.0).

Accepted examples: 1000. Rejected candidates: 0. Evaluation holdout: 10 (1.0%). Distinct plans: 100. Distinct compiled circuits: 1000 (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).

Acceptance class: every accepted example is `exact_verified` in the qualified sense defined by `DS008-training-data`: the executed circuit produced the printed answer, and the family computation reproduced it from the same reference parse. The independence that qualifies is stated under Limitations. An example whose printed answer the statement does not determine ships the computed answer instead and is `computed_verified`; it is listed under "Answers not shipped as printed".

Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.

## Accepted by category

- no-knowledge: 1000

## Accepted by problem type

no-knowledge/a-claim-that-could-be-wrong (10), no-knowledge/a-closed-incident-note (10), no-knowledge/a-control-as-written (10), no-knowledge/a-disanalogy-that-blocks-transfer (10),
no-knowledge/a-face-and-a-table (10), no-knowledge/a-feeling-of-certainty (10), no-knowledge/a-hidden-third-factor (10), no-knowledge/a-lab-note-and-a-first-check (10),
no-knowledge/a-leap-from-few-to-all (10), no-knowledge/a-living-likeness (10), no-knowledge/a-machine-that-stops (10), no-knowledge/a-mechanism-named-in-the-text (10),
no-knowledge/a-new-fact-reorders-the-list (10), no-knowledge/a-percent-without-a-base (10), no-knowledge/a-second-look (10), no-knowledge/a-slope-with-no-steps (10),
no-knowledge/a-social-fact-with-more-than-one-story (10), no-knowledge/a-vivid-side-road (10), no-knowledge/a-weaker-copy-of-the-claim (10),
no-knowledge/a-word-that-changes-meaning (10), no-knowledge/absolute-change-and-relative-change (10), no-knowledge/affirming-the-back (10),
no-knowledge/after-this-therefore-because-of-this (10), no-knowledge/an-extreme-result-then-a-quieter-one (10), no-knowledge/analogy-held-to-a-written-fact (10),
no-knowledge/anecdote-beside-a-comparison (10), no-knowledge/averages-that-hide-a-split (10), no-knowledge/base-rates-and-rare-events (10),
no-knowledge/before-after-without-a-twin (10), no-knowledge/capstone-cases-mixed-tools (10), no-knowledge/civic-text-number-and-cause (10), no-knowledge/common-cause (10),
no-knowledge/conditional-counts (10), no-knowledge/counterfactuals-with-a-held-fixed-list (10), no-knowledge/counting-twice (10), no-knowledge/definitions-as-rules (10),
no-knowledge/denying-the-front (10), no-knowledge/do-not-invent-the-missing-fact (10), no-knowledge/either-or-with-one-side-gone (10), no-knowledge/enumeration-is-not-a-climb (10),
no-knowledge/exhaustive-cases (10), no-knowledge/explanation-versus-proof (10), no-knowledge/false-analogy (10), no-knowledge/fame-crowd-and-borrowed-voice (10),
no-knowledge/fewer-extra-parts (10), no-knowledge/from-sample-toward-a-class (10), no-knowledge/going-in-a-circle (10), no-knowledge/headline-versus-table (10),
no-knowledge/historical-analogy (10), no-knowledge/hypothetical-chains (10), no-knowledge/if-and-only-if (10), no-knowledge/if-the-back-is-absent (10),
no-knowledge/if-the-front-is-present (10), no-knowledge/if-when-whenever (10), no-knowledge/inclusive-or-and-exclusive-or (10), no-knowledge/independent-and-not-independent (10),
no-knowledge/institutional-analogy (10), no-knowledge/looking-for-the-agreeable (10), no-knowledge/mapping-the-parts (10), no-knowledge/moving-together-is-not-making (10),
no-knowledge/necessary-conditions (10), no-knowledge/necessary-versus-sufficient-cause (10), no-knowledge/nested-conditionals (10), no-knowledge/one-miss-and-a-universal (10),
no-knowledge/only-two-rooms-when-the-building-has-more (10), no-knowledge/policy-under-uncertainty (10), no-knowledge/precaution-and-panic (10),
no-knowledge/ranking-rival-stories (10), no-knowledge/reading-a-study-summary (10), no-knowledge/relevant-versus-decorative-likeness (10),
no-knowledge/reverse-or-two-way-arrows (10), no-knowledge/rules-of-thumb (10), no-knowledge/scale-and-models (10), no-knowledge/several-contributors (10),
no-knowledge/small-choices-and-average-return (10), no-knowledge/small-samples-and-noise (10), no-knowledge/some-all-and-none (10),
no-knowledge/staying-because-of-what-was-already-spent (10), no-knowledge/sufficient-conditions (10), no-knowledge/symptoms-and-a-closed-leaflet (10),
no-knowledge/testimony-as-a-thin-sample (10), no-knowledge/the-already-ticked-box (10), no-knowledge/the-contrapositive (10), no-knowledge/the-first-number-pulls (10),
no-knowledge/the-person-instead-of-the-sentence (10), no-knowledge/the-scope-of-if (10), no-knowledge/the-visible-queue (10), no-knowledge/trends-that-may-not-continue (10),
no-knowledge/two-coats-for-one-quantity (10), no-knowledge/two-families-on-one-page (10), no-knowledge/two-written-rules-together (10),
no-knowledge/universals-applied-to-a-named-case (10), no-knowledge/unless-and-except (10), no-knowledge/watching-versus-assigning (10), no-knowledge/what-comes-easily-to-mind (10),
no-knowledge/when-a-climb-is-enough-to-act (10), no-knowledge/when-two-stories-still-fit (10), no-knowledge/who-got-counted (10), no-knowledge/who-owed-the-first-reason (10),
no-knowledge/winners-in-the-window (10)


## Accepted by section

- section 1: 10
- section 2: 10
- section 3: 10
- section 4: 10
- section 5: 10
- section 6: 10
- section 7: 10
- section 8: 10
- section 9: 10
- section 10: 10
- section 11: 10
- section 12: 10
- section 13: 10
- section 14: 10
- section 15: 10
- section 16: 10
- section 17: 10
- section 18: 10
- section 19: 10
- section 20: 10
- section 21: 10
- section 22: 10
- section 23: 10
- section 24: 10
- section 25: 10
- section 26: 10
- section 27: 10
- section 28: 10
- section 29: 10
- section 30: 10
- section 31: 10
- section 32: 10
- section 33: 10
- section 34: 10
- section 35: 10
- section 36: 10
- section 37: 10
- section 38: 10
- section 39: 10
- section 40: 10
- section 41: 10
- section 42: 10
- section 43: 10
- section 44: 10
- section 45: 10
- section 46: 10
- section 47: 10
- section 48: 10
- section 49: 10
- section 50: 10
- section 51: 10
- section 52: 10
- section 53: 10
- section 54: 10
- section 55: 10
- section 56: 10
- section 57: 10
- section 58: 10
- section 59: 10
- section 60: 10
- section 61: 10
- section 62: 10
- section 63: 10
- section 64: 10
- section 65: 10
- section 66: 10
- section 67: 10
- section 68: 10
- section 69: 10
- section 70: 10
- section 71: 10
- section 72: 10
- section 73: 10
- section 74: 10
- section 75: 10
- section 76: 10
- section 77: 10
- section 78: 10
- section 79: 10
- section 80: 10
- section 81: 10
- section 82: 10
- section 83: 10
- section 84: 10
- section 85: 10
- section 86: 10
- section 87: 10
- section 88: 10
- section 89: 10
- section 90: 10
- section 91: 10
- section 92: 10
- section 93: 10
- section 94: 10
- section 95: 10
- section 96: 10
- section 97: 10
- section 98: 10
- section 99: 10
- section 100: 10

## Rejected by reason


## Answers not shipped as printed

Every accepted example ships the answer its source prints.

## Family integrity checks

Templates covered: 100, of which 100 have several variants and 37 of those print several distinct answers, which is what shows that the computation reacts to its input.

Templates whose variants all print one answer, so the variants do not test recomputation:
- A claim that could be wrong (10 variants, one printed answer)
- A control as written (10 variants, one printed answer)
- A disanalogy that blocks transfer (10 variants, one printed answer)
- A face and a table (10 variants, one printed answer)
- A feeling of certainty (10 variants, one printed answer)
- A hidden third factor (10 variants, one printed answer)
- A lab note and a first check (10 variants, one printed answer)
- A leap from few to all (10 variants, one printed answer)
- A machine that stops (10 variants, one printed answer)
- A new fact reorders the list (10 variants, one printed answer)
- A second look (10 variants, one printed answer)
- A slope with no steps (10 variants, one printed answer)
- A social fact with more than one story (10 variants, one printed answer)
- A vivid side road (10 variants, one printed answer)
- A weaker copy of the claim (10 variants, one printed answer)
- A word that changes meaning (10 variants, one printed answer)
- Absolute change and relative change (10 variants, one printed answer)
- After this, therefore because of this (10 variants, one printed answer)
- An extreme result, then a quieter one (10 variants, one printed answer)
- Analogy held to a written fact (10 variants, one printed answer)
- Averages that hide a split (10 variants, one printed answer)
- Base rates and rare events (10 variants, one printed answer)
- Before-after without a twin (10 variants, one printed answer)
- Capstone cases — mixed tools (10 variants, one printed answer)
- Common cause (10 variants, one printed answer)
- Conditional counts (10 variants, one printed answer)
- Counting twice (10 variants, one printed answer)
- Explanation versus proof (10 variants, one printed answer)
- False analogy (10 variants, one printed answer)
- Fame, crowd, and borrowed voice (10 variants, one printed answer)
- Fewer extra parts (10 variants, one printed answer)
- Going in a circle (10 variants, one printed answer)
- Headline versus table (10 variants, one printed answer)
- Historical analogy (10 variants, one printed answer)
- If, when, whenever (10 variants, one printed answer)
- Independent and not independent (10 variants, one printed answer)
- Institutional analogy (10 variants, one printed answer)
- Moving together is not making (10 variants, one printed answer)
- Necessary versus sufficient cause (10 variants, one printed answer)
- One miss and a universal (10 variants, one printed answer)
- Only two rooms when the building has more (10 variants, one printed answer)
- Policy under uncertainty (10 variants, one printed answer)
- Reading a study summary (10 variants, one printed answer)
- Relevant versus decorative likeness (10 variants, one printed answer)
- Reverse or two-way arrows (10 variants, one printed answer)
- Scale and models (10 variants, one printed answer)
- Several contributors (10 variants, one printed answer)
- Small choices and average return (10 variants, one printed answer)
- Small samples and noise (10 variants, one printed answer)
- Sufficient conditions (10 variants, one printed answer)
- The already-ticked box (10 variants, one printed answer)
- The first number pulls (10 variants, one printed answer)
- The person instead of the sentence (10 variants, one printed answer)
- The scope of if (10 variants, one printed answer)
- The visible queue (10 variants, one printed answer)
- Trends that may not continue (10 variants, one printed answer)
- Two coats for one quantity (10 variants, one printed answer)
- Two families on one page (10 variants, one printed answer)
- Unless and except (10 variants, one printed answer)
- Watching versus assigning (10 variants, one printed answer)
- What comes easily to mind (10 variants, one printed answer)
- When two stories still fit (10 variants, one printed answer)
- Winners in the window (10 variants, one printed answer)

## Text blemishes

The statement scan found no missing-space artifacts around digits.

## Invariant-answer plans

The provenance probe perturbs every compiled value and asks whether the executed answer changes. Ten plan fingerprints of this book print one verdict for the whole family, and their `answer` wire returns that verdict as a constant after probing the shape of `slots`; no perturbation of the compiled values can change the answer, so the verifier reports those rows as "could not be proven either way". They are listed here because the invariance is a property of the source family rather than an unresolved defect: every one of these circuits reproduces the printed answer of its manifest row, and every statement of the family carries the same printed verdict.

| plan | family | rows | shipped answer |
| --- | --- | --- | --- |
| 39f0525dfec6 | A claim that could be wrong | 10 | One armoured against any observation. That is slogan-strength, not science-strength. Untouchable is not strong; it has left the game. |
| 7536c4a47b02 | A machine that stops | 10 | Try the reset. It is the listed cheap test that fits the listed signs. A burnt motor is an extra engine. |
| 29b7f4ac4353 | A new fact reorders the list | 10 | Reorder. The new fact fights “this bulb only” and supports “this socket.” Updating is the method working. |
| c545a3cbaa3a | A word that changes meaning | 10 | Equivocation: one spelling, two jobs. The floor rule was about weight. The lamp line is about visibility. |
| e9c42fd56cdf | Capstone cases — mixed tools | 10 | It refuses the headline as costume, notes that iron sinking does not speak about ice, keeps the density mechanism, and sets aside the person-strike. Loudness is not a family of reasoning. |
| 5a41885e646f | Fewer extra parts | 10 | Prefer the bulb-only story as a start; it adds less unlisted machinery. Ranking is not proof. Then do the cheap test. |
| 37546e05bb7b | Relevant versus decorative likeness | 10 | The structure: break the path, the working stops. Wetness is decorative. |
| 146d8e9b6876 | The already-ticked box | 10 | Status quo / default. Nature did not mark the box. Answer as if both boxes started empty. |
| 8a42dc894a45 | Two families on one page | 10 | Yes. The training sentence is a definitional mechanism on the card. Three tired evenings are a small sample about a side feeling, not a refutation of what the card said a vaccine is. |
| b31ec981a887 | When two stories still fit | 10 | A tie on present signs. Drama does not break a tie. A method that leaves a tie has told you what to measure next. |

Consequence for training: these rows teach a constant-verdict plan — the compiled values are extracted and shape-checked, but the computation does not dispatch on them — which is exactly what the source family prints. Whether such families are extended with cases whose verdict differs is decided by the failure analysis of the first training run, not here.

## Limitations

- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.
- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.
- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.
- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.
- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.
