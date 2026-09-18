# Dataset report

Source: `vision/Adult_Reasoning_and_Everyday_Knowledge_Course.docx` (raw 4815c5e4d235e0bb, canonical 51aa922513d38208, extractor docx-canvas-text 1.1.0).

Accepted examples: 1000. Rejected candidates: 0. Evaluation holdout: 10 (1.0%). Distinct plans: 100. Distinct compiled circuits: 772 (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).

Acceptance class: every accepted example is `exact_verified` in the qualified sense defined by `DS008-training-data`: the executed circuit produced the printed answer, and the family computation reproduced it from the same reference parse. The independence that qualifies is stated under Limitations. An example whose printed answer the statement does not determine ships the computed answer instead and is `computed_verified`; it is listed under "Answers not shipped as printed".

Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.

## Accepted by category

- no-knowledge: 1000

## Accepted by problem type

no-knowledge/a-clear-message-versus-a-vague-one (10), no-knowledge/a-declared-conflict-of-interest (10), no-knowledge/a-plan-in-steps-with-dependencies (10),
no-knowledge/a-public-counters-opening-hours (10), no-knowledge/a-summarised-insurance-policy (10), no-knowledge/a-synthesis-from-several-fragments (10),
no-knowledge/a-voting-procedure-from-a-rulebook (10), no-knowledge/a-weather-bulletin-and-a-decision (10), no-knowledge/a-written-norm-versus-a-habit (10),
no-knowledge/allergens-and-declared-ingredients (10), no-knowledge/an-extract-from-an-employment-contract (10), no-knowledge/appeal-deadlines-and-petitions (10),
no-knowledge/averages-ratios-and-parts-of-a-whole (10), no-knowledge/body-numbers-presented-in-a-text (10), no-knowledge/bus-and-train-timetables (10),
no-knowledge/calendars-deadlines-and-working-days (10), no-knowledge/cardinal-points-and-meeting-places (10), no-knowledge/charts-told-in-prose (10),
no-knowledge/comparing-two-or-three-offers (10), no-knowledge/contracts-and-plain-clauses (10), no-knowledge/cooperation-roles-and-blockages (10),
no-knowledge/correlation-cause-and-coincidence (10), no-knowledge/daily-travel-and-its-cost (10), no-knowledge/density-weight-and-floating (10),
no-knowledge/domestic-emergency-guides (10), no-knowledge/doses-according-to-the-given-leaflet (10), no-knowledge/drinking-water-leaks-and-meters (10),
no-knowledge/earth-moon-and-length-of-day (10), no-knowledge/estimates-and-order-of-magnitude (10), no-knowledge/fees-and-commissions-as-written (10),
no-knowledge/files-copies-and-versions (10), no-knowledge/finite-resources-described-in-numbers (10), no-knowledge/first-aid-procedures-as-written (10),
no-knowledge/food-chains-in-a-described-ecosystem (10), no-knowledge/frequency-chance-and-expected-number (10), no-knowledge/game-rules-and-house-rules (10),
no-knowledge/generalising-from-a-small-sample (10), no-knowledge/good-middle-bad-scenarios (10), no-knowledge/heat-temperature-and-changes-of-state (10),
no-knowledge/hidden-errors-in-published-sums (10), no-knowledge/hours-breaks-and-overtime (10), no-knowledge/houseplants-and-the-garden (10),
no-knowledge/hygiene-and-cross-contamination (10), no-knowledge/income-tax-in-a-closed-scenario (10), no-knowledge/indoor-temperature-and-insulation (10),
no-knowledge/instructions-and-warnings (10), no-knowledge/internal-inconsistencies-in-a-story (10), no-knowledge/internal-rules-and-sanctions (10),
no-knowledge/issuing-a-document-from-a-guide (10), no-knowledge/letters-messages-and-addressees (10), no-knowledge/licences-and-reuse-as-written (10),
no-knowledge/light-shadow-and-reflection (10), no-knowledge/lists-tables-and-footnotes (10), no-knowledge/maps-and-legends-described (10),
no-knowledge/materials-hardness-conduction-solubility (10), no-knowledge/messages-that-demand-hurried-action (10), no-knowledge/micro-organisms-in-an-educational-text (10),
no-knowledge/negotiation-with-written-constraints (10), no-knowledge/networks-bandwidth-and-waiting (10), no-knowledge/news-headline-and-body (10),
no-knowledge/numeric-scale-and-real-distance (10), no-knowledge/nutrition-labels (10), no-knowledge/offers-ads-and-conditions (10), no-knowledge/opportunity-cost (10),
no-knowledge/passwords-sessions-and-recovery (10), no-knowledge/percents-discounts-and-markups (10), no-knowledge/perimeter-and-area-in-practical-cases (10),
no-knowledge/personal-data-in-terms-of-use (10), no-knowledge/plants-light-and-water (10), no-knowledge/point-of-view-and-interest (10),
no-knowledge/portions-meals-and-equivalents (10), no-knowledge/power-time-and-consumption (10), no-knowledge/premises-conclusions-and-leaps (10),
no-knowledge/prices-change-and-rounding (10), no-knowledge/promises-conditions-and-keeping-them (10), no-knowledge/pronouns-references-and-ambiguity (10),
no-knowledge/public-signs-described-in-words (10), no-knowledge/reading-an-energy-bill-line-by-line (10), no-knowledge/recipes-procedures-and-step-order (10),
no-knowledge/recycling-sorting-and-exceptions (10), no-knowledge/rent-repairs-and-inventory (10), no-knowledge/reserve-insurance-and-excess (10),
no-knowledge/simple-circuits-and-fuses (10), no-knowledge/simple-interest-and-instalments (10), no-knowledge/sleep-rest-and-daily-rhythm (10),
no-knowledge/sound-distance-and-obstacles (10), no-knowledge/source-claim-and-evidence (10), no-knowledge/speed-duration-and-distance (10),
no-knowledge/statistics-presented-selectively (10), no-knowledge/testimony-memory-and-confirmation (10), no-knowledge/the-monthly-budget (10),
no-knowledge/thinking-traps-illustrated (10), no-knowledge/time-zones-from-a-given-table (10), no-knowledge/timelines-and-chained-causes (10),
no-knowledge/units-and-conversions (10), no-knowledge/urgent-versus-important (10), no-knowledge/use-by-dates-and-storage (10), no-knowledge/volumes-containers-and-mixtures (10),
no-knowledge/water-effort-and-temperature (10), no-knowledge/who-knows-what (10)


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

Templates covered: 100, of which 100 have several variants and 50 of those print several distinct answers, which is what shows that the computation reacts to its input.

Templates whose variants all print one answer, so the variants do not test recomputation:
- A clear message versus a vague one (10 variants, one printed answer)
- A declared conflict of interest (10 variants, one printed answer)
- A public counter's opening hours (10 variants, one printed answer)
- A written norm versus a habit (10 variants, one printed answer)
- Allergens and declared ingredients (10 variants, one printed answer)
- An extract from an employment contract (10 variants, one printed answer)
- Appeal deadlines and petitions (10 variants, one printed answer)
- Body numbers presented in a text (10 variants, one printed answer)
- Calendars, deadlines, and working days (10 variants, one printed answer)
- Contracts and plain clauses (10 variants, one printed answer)
- Correlation, cause, and coincidence (10 variants, one printed answer)
- Domestic emergency guides (10 variants, one printed answer)
- Doses according to the given leaflet (10 variants, one printed answer)
- Earth, moon, and length of day (10 variants, one printed answer)
- Files, copies, and versions (10 variants, one printed answer)
- First-aid procedures as written (10 variants, one printed answer)
- Food chains in a described ecosystem (10 variants, one printed answer)
- Frequency, chance, and expected number (10 variants, one printed answer)
- Game rules and house rules (10 variants, one printed answer)
- Generalising from a small sample (10 variants, one printed answer)
- Heat, temperature, and changes of state (10 variants, one printed answer)
- Hours, breaks, and overtime (10 variants, one printed answer)
- Houseplants and the garden (10 variants, one printed answer)
- Hygiene and cross-contamination (10 variants, one printed answer)
- Indoor temperature and insulation (10 variants, one printed answer)
- Internal inconsistencies in a story (10 variants, one printed answer)
- Internal rules and sanctions (10 variants, one printed answer)
- Issuing a document from a guide (10 variants, one printed answer)
- Licences and reuse as written (10 variants, one printed answer)
- Light, shadow, and reflection (10 variants, one printed answer)
- Maps and legends described (10 variants, one printed answer)
- Materials: hardness, conduction, solubility (10 variants, one printed answer)
- Messages that demand hurried action (10 variants, one printed answer)
- Micro-organisms in an educational text (10 variants, one printed answer)
- Networks, bandwidth, and waiting (10 variants, one printed answer)
- Passwords, sessions, and recovery (10 variants, one printed answer)
- Personal data in terms of use (10 variants, one printed answer)
- Plants, light, and water (10 variants, one printed answer)
- Point of view and interest (10 variants, one printed answer)
- Portions, meals, and equivalents (10 variants, one printed answer)
- Public signs described in words (10 variants, one printed answer)
- Recipes, procedures, and step order (10 variants, one printed answer)
- Recycling, sorting, and exceptions (10 variants, one printed answer)
- Simple circuits and fuses (10 variants, one printed answer)
- Sleep, rest, and daily rhythm (10 variants, one printed answer)
- Sound, distance, and obstacles (10 variants, one printed answer)
- Source, claim, and evidence (10 variants, one printed answer)
- Timelines and chained causes (10 variants, one printed answer)
- Urgent versus important (10 variants, one printed answer)
- Use-by dates and storage (10 variants, one printed answer)

## Text blemishes

The source itself prints these missing-space artifacts around digits (a word glued to a digit); the extraction is faithful and does not repair them:
- 721: ea2
- 722: ea2
- 723: ea2
- 724: ea2
- 725: ea2
- 726: ea2
- 727: ea2
- 728: ea2
- 729: ea2
- 730: ea2
- 761: 2sep
- 761: 0sep
- 761: 2sep
- 762: 2sep
- 762: 0sep
- 762: 2sep
- 763: 2sep
- 763: 0sep
- 763: 2sep
- 764: 2sep
- 764: 0sep
- 764: 2sep
- 765: 2sep
- 765: 0sep
- 765: 2sep
- 766: 2sep
- 766: 0sep
- 766: 2sep
- 767: 2sep
- 767: 0sep
- 767: 2sep
- 768: 2sep
- 768: 0sep
- 768: 2sep
- 769: 2sep
- 769: 0sep
- 769: 2sep
- 770: 2sep
- 770: 0sep
- 770: 2sep

## Limitations

- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.
- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.
- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.
- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.
- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.
