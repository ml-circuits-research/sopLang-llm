# Dataset report

Source: `vision/Mathematical_Thinking_1000_Problems_Grades_1-4_EN.docx` (raw 9b6168e51d504f80, canonical 8d9698559858c746, extractor docx-canvas-text 1.1.0).

Accepted examples: 1000. Rejected candidates: 0. Evaluation holdout: 10 (1.0%). Distinct plans: 589. Distinct compiled circuits: 999 (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).

Acceptance class: every accepted example is `exact_verified` in the qualified sense defined by `DS008-training-data`: the executed circuit produced the printed answer, and the family computation reproduced it from the same reference parse. The independence that qualifies is stated under Limitations. An example whose printed answer the statement does not determine ships the computed answer instead and is `computed_verified`; it is listed under "Answers not shipped as printed".

Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.

## Accepted by category

- knowledge: 60
- no-knowledge: 940

## Accepted by problem type

knowledge/a-180-rotation-as-two-quarter-turns (1), knowledge/a-balance-scale-in-equilibrium (1), knowledge/a-balance-with-one-known-and-one-unknown-object (1),
knowledge/a-calendar-with-blocked-days (1), knowledge/a-deadline-two-working-days-later (1), knowledge/a-month-with-one-explicitly-added-day (1),
knowledge/a-point-lying-on-the-axis (1), knowledge/a-simplified-30-day-calendar (1), knowledge/a-truth-table-for-two-conditions (1),
knowledge/converting-a-rate-across-equal-intervals (1), knowledge/correlation-described-not-causation-demonstrated (1), knowledge/decoding-a-compressed-representation (1),
knowledge/decoding-with-a-one-to-one-dictionary (1), knowledge/effect-of-an-outlier-on-the-mean (1), knowledge/effect-of-an-outlier-on-the-median (1),
knowledge/events-at-equal-intervals (5), knowledge/exactly-one-success (1), knowledge/four-90-rotations (1), knowledge/identifying-a-transformation-from-its-effect (1),
knowledge/latest-starting-time (5), knowledge/mean-from-a-frequency-table (1), knowledge/meters-and-centimeters (5), knowledge/missing-value-from-a-mean (1),
knowledge/perimeter-measured-with-a-strip (1), knowledge/probability-zero-after-new-information (1), knowledge/reflecting-a-column-across-a-vertical-axis (1),
knowledge/same-mean-different-spread (1), knowledge/same-problem-different-score-function (1), knowledge/the-day-four-days-ago (1), knowledge/the-first-day-of-the-next-month (1),
knowledge/the-last-day-of-a-given-month (1), knowledge/the-mean-changes-when-a-value-is-added (1), knowledge/the-mean-need-not-be-one-of-the-observed-values (1),
knowledge/the-remainder-after-complete-weeks (1), knowledge/three-consecutive-working-days (1), knowledge/timeline (5), knowledge/transforming-a-shape-and-the-path-of-a-point (1),
knowledge/two-answers-that-identify-an-object (1), knowledge/two-objects-with-the-same-code (1), knowledge/two-reflections-in-the-same-axis (1),
knowledge/weighted-data-through-repetition (1), knowledge/which-properties-does-rotation-preserve (1), knowledge/which-properties-does-translation-preserve (1),
knowledge/without-information-the-same-result-cannot-be-guaranteed (1), no-knowledge/3-times-as-much-as-grouping (3), no-knowledge/4-times-as-much-as-grouping (1),
no-knowledge/5-times-as-much-as-grouping (1), no-knowledge/a-break-adds-no-distance (1), no-knowledge/a-categorys-share-as-part-of-the-total (1),
no-knowledge/a-cell-halfway-between-two-landmarks (1), no-knowledge/a-certain-answer-without-knowing-the-exact-object (1), no-knowledge/a-certain-event (1),
no-knowledge/a-chain-of-implications-does-not-work-backward (1), no-knowledge/a-checksum-detects-a-changed-digit (1), no-knowledge/a-closed-path (1),
no-knowledge/a-clue-that-changes-nothing (1), no-knowledge/a-clue-whose-usefulness-depends-on-another-clue (1), no-knowledge/a-code-that-must-contain-a-given-digit (1),
no-knowledge/a-code-with-a-restricted-first-digit (1), no-knowledge/a-conclusion-that-does-not-follow-from-the-data (1), no-knowledge/a-cumulative-value (1),
no-knowledge/a-cycle-of-three-tasks (1), no-knowledge/a-dominant-category-under-two-criteria (1), no-knowledge/a-fair-game-under-the-given-definition (1),
no-knowledge/a-fixed-point-under-rotation (1), no-knowledge/a-graduated-container (1), no-knowledge/a-group-defined-by-two-thresholds (1),
no-knowledge/a-growth-rule-in-a-drawing (1), no-knowledge/a-half-turn-rotation (1), no-knowledge/a-loop-that-cannot-stop (1), no-knowledge/a-losing-position-in-the-1-or-2-game (1),
no-knowledge/a-lower-bound-from-whole-objects (1), no-knowledge/a-menu-with-one-choice-from-each-category (1), no-knowledge/a-message-with-extra-information (1),
no-knowledge/a-missing-cell-from-two-totals (1), no-knowledge/a-missing-piece-in-a-mosaic (1), no-knowledge/a-missing-value-from-the-total (1),
no-knowledge/a-necessary-and-sufficient-condition (1), no-knowledge/a-necessary-but-not-sufficient-property (1), no-knowledge/a-necessary-condition-for-acceptance (1),
no-knowledge/a-negative-clue-can-be-stronger (1), no-knowledge/a-network-of-points-and-links (1), no-knowledge/a-network-with-edge-capacity (1),
no-knowledge/a-path-that-is-not-closed-despite-four-moves (1), no-knowledge/a-path-with-more-edges-can-be-cheaper (1), no-knowledge/a-pattern-of-length-three (1),
no-knowledge/a-pattern-with-two-alternative-rules (1), no-knowledge/a-pictogram-where-one-symbol-represents-two-objects (1), no-knowledge/a-piece-that-cannot-fill-a-gap (1),
no-knowledge/a-product-with-an-even-factor (1), no-knowledge/a-property-that-is-possible-but-not-certain (1), no-knowledge/a-repeating-two-dimensional-pattern (1),
no-knowledge/a-required-intermediate-landmark (1), no-knowledge/a-route-described-by-cardinal-steps (1), no-knowledge/a-route-of-three-segments (5),
no-knowledge/a-rule-set-with-no-uncovered-case (1), no-knowledge/a-rule-true-for-all-tested-examples-is-not-automatically-uni (1), no-knowledge/a-rule-with-priority (1),
no-knowledge/a-schedule-with-a-defined-weekend (1), no-knowledge/a-square-divided-into-four-small-squares (1), no-knowledge/a-stated-maximum-error (1),
no-knowledge/a-structure-with-a-common-center (1), no-knowledge/a-sufficient-condition-for-acceptance (1), no-knowledge/a-table-with-a-column-total (1),
no-knowledge/a-table-with-a-row-total (1), no-knowledge/a-transfer-that-preserves-the-total (5), no-knowledge/a-transformation-that-cannot-cause-enlargement (1),
no-knowledge/a-true-statement-is-not-the-same-as-a-valid-proof (1), no-knowledge/a-two-bit-code-in-child-friendly-language (1), no-knowledge/a-two-digit-code-without-repetition (1),
no-knowledge/a-two-question-classification-tree (1), no-knowledge/a-two-way-table (1), no-knowledge/a-witness-for-the-word-exists (1),
no-knowledge/add-one-link-to-connect-the-network (1), no-knowledge/adding-errors-in-the-worst-case (1), no-knowledge/adjacency-on-a-grid (1),
no-knowledge/after-a-whole-number-of-weeks (1), no-knowledge/algorithm-on-a-large-number (5), no-knowledge/algorithm-with-a-counter (1),
no-knowledge/algorithm-with-a-filter-before-summing (1), no-knowledge/algorithm-with-an-accumulated-sum (1), no-knowledge/allocation-with-minimum-limits (5),
no-knowledge/alternating-rule (5), no-knowledge/alternating-work-and-rest (1), no-knowledge/alternative-route-after-a-failure (1),
no-knowledge/ambiguous-code-caused-by-a-prefix (1), no-knowledge/an-ambiguous-map-instruction (1), no-knowledge/an-axis-of-symmetry-by-matching-halves (1),
no-knowledge/an-event-every-two-days (1), no-knowledge/an-impossible-event (1), no-knowledge/an-impossible-rule-combination (1),
no-knowledge/an-incomplete-message-with-multiple-interpretations (1), no-knowledge/an-intuitive-contrapositive-in-a-universal-rule (1),
no-knowledge/an-obstacle-makes-a-route-impossible (1), no-knowledge/an-outfit-from-two-independent-choices (1), no-knowledge/an-unfair-game-hidden-behind-two-labels (1),
no-knowledge/an-unknown-inverse-transformation (1), no-knowledge/an-upper-bound-from-an-object-that-does-not-fit (1), no-knowledge/area-as-a-number-of-unit-squares (5),
no-knowledge/area-of-a-rectangle (5), no-knowledge/area-with-a-corner-cut-out (5), no-knowledge/arithmetic-mean-defined-by-dividing-the-sum (1),
no-knowledge/arrangements-of-three-distinct-objects (1), no-knowledge/arrangements-where-two-objects-must-be-adjacent (1), no-knowledge/arrangements-with-one-book-fixed (1),
no-knowledge/at-least-one-of-two-properties (1), no-knowledge/at-least-one-success (1), no-knowledge/at-least-two-as-a-threshold (1), no-knowledge/at-most-one-as-a-limit (1),
no-knowledge/average-speed-explicitly-defined (1), no-knowledge/balance-with-equality-and-comparison (1), no-knowledge/balancing-tasks-between-two-machines (1),
no-knowledge/balancing-two-boxes (5), no-knowledge/base-ten-and-base-two-representation (1), no-knowledge/battery-remaining-after-consumption (1),
no-knowledge/biased-sample-under-an-explicit-selection-rule (1), no-knowledge/binary-code-with-two-positions (1), no-knowledge/binary-value-from-given-weights (1),
no-knowledge/boxes-with-fixed-capacity (1), no-knowledge/budget-with-a-minimum-requirement-in-each-category (1), no-knowledge/budget-with-two-types-of-objects (1),
no-knowledge/build-the-binary-code-for-a-value (1), no-knowledge/build-the-number-from-tens-and-ones (5), no-knowledge/can-the-battery-support-the-duration (1),
no-knowledge/can-the-sum-of-degrees-be-odd (1), no-knowledge/can-you-reach-the-target-number (5), no-knowledge/center-by-maximum-distance (1),
no-knowledge/central-symmetry-on-a-number-line (1), no-knowledge/change-the-tens-and-ones (5), no-knowledge/changing-a-total-after-correcting-one-datum (1),
no-knowledge/changing-field-order-changes-meaning (1), no-knowledge/chasing-in-the-same-direction (1), no-knowledge/checking-a-conditional-statement-on-a-finite-domain (1),
no-knowledge/checking-whether-a-stated-total-is-correct (1), no-knowledge/checksum-modulo (1), no-knowledge/choice-by-two-criteria (5),
no-knowledge/choice-with-two-objectives-and-priority (1), no-knowledge/choose-a-test-case-that-finds-the-bug (1),
no-knowledge/choose-between-two-feasible-plans-using-a-score-function (1), no-knowledge/choose-by-total-cost-not-unit-price (1),
no-knowledge/choose-the-box-that-fits-the-longest-object-dimension (1), no-knowledge/choose-the-compatible-result (5), no-knowledge/choose-the-correct-instruction (5),
no-knowledge/choose-the-fastest-route-not-the-shortest (1), no-knowledge/choose-the-question-that-splits-best (1), no-knowledge/choose-the-rule-that-explains-the-examples (5),
no-knowledge/choose-the-shortest-route (5), no-knowledge/choose-under-both-weight-and-volume-constraints (1), no-knowledge/choosing-a-pair-with-an-incompatibility (1),
no-knowledge/choosing-a-route-through-ordered-gates (1), no-knowledge/choosing-two-objects-of-different-colors (1),
no-knowledge/circular-arrangements-with-a-fixed-reference-point (1), no-knowledge/classification-by-two-properties (5),
no-knowledge/classification-into-three-non-overlapping-boxes (1), no-knowledge/classification-rule-tested-on-cases (1), no-knowledge/classify-by-number-of-sides (5),
no-knowledge/code-collision (1), no-knowledge/code-dictionary-as-a-mapping-table (1), no-knowledge/code-with-a-length-field (1), no-knowledge/coins-minimum-number-of-pieces (1),
no-knowledge/coins-with-given-values (5), no-knowledge/combinations-by-listing (5), no-knowledge/compare-fractions-with-the-same-denominator (5),
no-knowledge/compare-materials-by-density (1), no-knowledge/compare-two-algorithms-by-number-of-steps (1), no-knowledge/compare-two-groups-by-percentage-not-absolute-count (1),
no-knowledge/compare-two-unit-prices (1), no-knowledge/comparing-chances-without-decimals (1), no-knowledge/comparing-masses-with-balance-scales (1),
no-knowledge/comparing-two-chances-with-the-same-total (1), no-knowledge/complete-packages-and-a-remainder (5), no-knowledge/complete-to-one-whole (5),
no-knowledge/completing-an-alternating-construction (1), no-knowledge/composing-two-rotations (1), no-knowledge/compression-by-counting-repetitions (1),
no-knowledge/conclusion-through-a-chain-of-implications (1), no-knowledge/connected-network (1), no-knowledge/conservation-of-mass-during-transfer (1),
no-knowledge/conserved-total-in-a-transfer-game (5), no-knowledge/constructing-a-counterexample-systematically (1), no-knowledge/consumption-per-100-km-explicitly-defined (1),
no-knowledge/contradiction-from-two-rules (1), no-knowledge/contradictory-clues (1), no-knowledge/coordinate-code (1), no-knowledge/cost-on-links (1),
no-knowledge/counting-by-complement (1), no-knowledge/counting-by-disjoint-cases (1), no-knowledge/counting-shapes-without-counting-empty-spaces (1),
no-knowledge/counting-unit-rectangles-in-a-grid (1), no-knowledge/counting-with-overlap-between-two-lists (1), no-knowledge/covering-with-rectangular-tiles (5),
no-knowledge/critical-node-in-a-network (1), no-knowledge/cuts-when-stacking-is-allowed (1), no-knowledge/cutting-a-rectangle-into-two-pieces (1),
no-knowledge/de-morgans-rule-through-a-finite-example (1), no-knowledge/debugging-with-a-test-case (1), no-knowledge/decision-based-on-defined-probability-and-payoff (1),
no-knowledge/decision-with-a-two-stage-tree (1), no-knowledge/decrease-below-zero-on-a-defined-scale (1), no-knowledge/decrease-from-one-day-to-the-next (1),
no-knowledge/deduction-by-excluding-categories (1), no-knowledge/defined-cut-and-choose-division (1), no-knowledge/delayed-start (1),
no-knowledge/density-defined-as-mass-per-unit-volume (1), no-knowledge/detect-a-measurement-incompatible-with-the-model (1),
no-knowledge/detect-a-missing-letter-using-the-length-field (1), no-knowledge/detect-incompatible-data (1), no-knowledge/detect-that-the-rate-is-not-constant (1),
no-knowledge/detecting-a-conclusion-that-is-too-strong (1), no-knowledge/detecting-an-error-with-parity (1), no-knowledge/direct-link-versus-indirect-path (1),
no-knowledge/direction-in-a-one-way-network (1), no-knowledge/distance-along-grid-streets (1), no-knowledge/distance-between-landmarks-not-from-the-start (1),
no-knowledge/distance-from-speed-and-time (1), no-knowledge/distance-in-a-network (1), no-knowledge/distributing-two-distinct-objects-into-two-boxes (1),
no-knowledge/distribution-with-both-boxes-nonempty (1), no-knowledge/do-not-reverse-an-implication (1), no-knowledge/drawing-with-replacement-the-composition-remains (1),
no-knowledge/drawing-without-replacement-the-second-chance-changes (1), no-knowledge/ecological-plan-with-a-renewable-resource (1), no-knowledge/edge-trail-in-a-chain (1),
no-knowledge/energy-consumption-per-hour (1), no-knowledge/equal-boxes-and-leftover-objects (5), no-knowledge/equal-groups-plus-an-extra-amount (5),
no-knowledge/equally-likely-outcomes (1), no-knowledge/equivalence-proved-in-both-directions (1), no-knowledge/equivalent-fractions-by-scaling (5),
no-knowledge/estimating-by-bounding (1), no-knowledge/evaluating-a-condition-on-every-state (1), no-knowledge/even-parity-bit (1),
no-knowledge/even-parity-when-the-number-of-ones-is-odd (1), no-knowledge/events-that-can-overlap (1), no-knowledge/events-that-cannot-occur-simultaneously (1),
no-knowledge/exact-payment-versus-overshooting (1), no-knowledge/exactly-one-1-in-a-code (1), no-knowledge/exactly-one-correct-label (1), no-knowledge/exactly-one-property (1),
no-knowledge/exactly-one-statement-is-true (1), no-knowledge/exactly-two-does-not-mean-at-least-two (1), no-knowledge/exactly-two-statements-are-true (1),
no-knowledge/exclusive-or-means-exactly-one (1), no-knowledge/fence-on-three-sides (5), no-knowledge/filling-and-draining-simultaneously (1),
no-knowledge/filling-time-at-constant-flow (1), no-knowledge/filling-with-two-package-sizes (1), no-knowledge/filling-with-two-taps (1),
no-knowledge/filtering-a-table-by-a-condition (1), no-knowledge/find-the-base-group (5), no-knowledge/five-day-table (5), no-knowledge/fixed-length-code-and-number-of-messages (1),
no-knowledge/flow-rate-defined-as-volume-per-minute (1), no-knowledge/forming-pairs (5), no-knowledge/four-digit-number-from-place-values (5),
no-knowledge/fraction-of-a-larger-quantity (5), no-knowledge/fraction-of-a-set (5), no-knowledge/frequency-from-a-table (1), no-knowledge/game-with-an-exact-target (1),
no-knowledge/grid-positions-row-and-column (5), no-knowledge/h-t-o-code (5), no-knowledge/half-a-symbol-in-a-pictogram (1),
no-knowledge/how-many-bits-are-needed-for-five-labels (1), no-knowledge/how-many-distinct-corners-does-a-strip-of-two-squares-have (1),
no-knowledge/how-many-objects-share-the-same-property (1), no-knowledge/how-many-occurrences-by-a-date (1), no-knowledge/how-many-packages (5),
no-knowledge/how-many-segments-does-a-row-of-joined-squares-have (1), no-knowledge/how-many-were-added (5), no-knowledge/how-much-more-is-needed-to-reach-a-target (1),
no-knowledge/hypothesis-conclusion-and-domain (1), no-knowledge/if-else-branch (1), no-knowledge/implication-as-an-access-rule (1), no-knowledge/impossibility-by-parity (1),
no-knowledge/impossible-data-in-a-table (1), no-knowledge/improve-the-correct-bottleneck (1), no-knowledge/increase-from-one-day-to-the-next (1),
no-knowledge/indirect-comparison-using-a-string (1), no-knowledge/information-changes-probability (1), no-knowledge/information-from-the-absence-of-a-result (1),
no-knowledge/information-that-completes-a-non-unique-puzzle (1), no-knowledge/instruction-order-changes-the-result (1), no-knowledge/intervals-that-only-touch (1),
no-knowledge/intuitive-concentration-as-a-fraction-of-the-total (1), no-knowledge/intuitive-dimensional-check (1), no-knowledge/invariant-in-a-transfer-loop (1),
no-knowledge/inventory-with-a-reorder-threshold (1), no-knowledge/irreversible-algorithm-because-information-is-lost (1), no-knowledge/isolated-node (1),
no-knowledge/largest-allowed-numerical-code (5), no-knowledge/largest-value-with-three-bits (1), no-knowledge/left-and-right-after-a-turn (1),
no-knowledge/lever-modeled-by-force-distance (1), no-knowledge/limitation-of-parity-two-errors-can-go-undetected (1), no-knowledge/linear-search-in-a-list (1),
no-knowledge/loop-until-a-threshold-is-reached (1), no-knowledge/loop-with-a-fixed-number-of-repetitions (1), no-knowledge/majority-does-not-help-if-two-sensors-may-be-wrong (1),
no-knowledge/making-the-better-choice-in-a-game (1), no-knowledge/map-distance-from-real-distance (1), no-knowledge/map-legend-and-route-length (1),
no-knowledge/map-scale-defined-as-a-ratio (1), no-knowledge/mass-of-contents-by-subtraction (1), no-knowledge/maximize-value-under-a-capacity-limit (1),
no-knowledge/maximum-minimum-and-ties (5), no-knowledge/mean-as-balancing (1), no-knowledge/measurement-by-whole-units-and-a-remainder (1),
no-knowledge/measuring-by-counting-tiles (1), no-knowledge/measuring-with-equal-sticks (1), no-knowledge/median-of-an-ordered-list (1),
no-knowledge/median-with-an-even-number-of-values (1), no-knowledge/meeting-from-opposite-directions (1), no-knowledge/minimize-cost-for-a-minimum-quantity (1),
no-knowledge/minimize-waiting-for-the-earliest-tasks (1), no-knowledge/minimum-cuts-for-equal-pieces (1), no-knowledge/minimum-detour-around-a-blockage (1),
no-knowledge/minimum-number-of-questions-for-four-possibilities (1), no-knowledge/minimum-wasted-space (1), no-knowledge/mixed-constraints-for-a-mission (1),
no-knowledge/mixed-three-stage-model (5), no-knowledge/mixture-without-reaction-volumes-add-under-the-given-rule (1), no-knowledge/mode-as-the-most-frequent-value (1),
no-knowledge/negating-a-condition (1), no-knowledge/negating-and-allows-at-least-one-failure (1), no-knowledge/neither-property (1), no-knowledge/nested-branches (1),
no-knowledge/node-with-the-most-links (1), no-knowledge/number-from-allowed-digits (5), no-knowledge/number-of-handshakes (1),
no-knowledge/number-of-links-in-a-small-complete-network (1), no-knowledge/numbered-seats (5), no-knowledge/observed-frequency-versus-probability (1),
no-knowledge/one-counterexample-is-enough-to-refute-all (1), no-knowledge/one-group-entirely-inside-another (1), no-knowledge/one-pass-of-sorting-by-swaps (1),
no-knowledge/one-way-direction-that-blocks-the-return (1), no-knowledge/one-worker-stops-halfway-through (1), no-knowledge/opposite-translations-partially-cancel (1),
no-knowledge/optimistic-versus-robust-decision-making (1), no-knowledge/optimization-with-equal-groups (1), no-knowledge/order-in-a-line (5),
no-knowledge/order-matters-in-a-race (1), no-knowledge/order-with-minimum-lot-sizes (1), no-knowledge/ordering-landmarks-along-a-path (1),
no-knowledge/original-total-from-a-percentage (1), no-knowledge/overlapping-rules (1), no-knowledge/overlapping-time-intervals (1),
no-knowledge/pairs-where-order-does-not-matter (1), no-knowledge/pairs-with-different-types-of-partners (1), no-knowledge/parentheses-change-the-rule (1),
no-knowledge/path-blocked-after-removing-an-edge (1), no-knowledge/paths-with-one-blocked-branch (1), no-knowledge/paths-with-two-successive-choices (1),
no-knowledge/percent-defined-as-out-of-100 (1), no-knowledge/percentage-from-a-table (1), no-knowledge/perimeter-of-a-rectangle (5),
no-knowledge/perimeter-of-an-l-shaped-figure (5), no-knowledge/periodicity-with-a-break-after-every-three-events (1), no-knowledge/pieces-that-form-a-rectangle (1),
no-knowledge/plan-robust-to-one-missing-unit (1), no-knowledge/plan-with-a-deadline-dependency (1), no-knowledge/plan-with-dependency-and-value (1),
no-knowledge/plant-growth-rate-as-change-per-day (1), no-knowledge/points-in-the-same-column (1), no-knowledge/policy-with-simplified-hysteresis (1), no-knowledge/polyline (5),
no-knowledge/position-in-a-repeating-pattern (5), no-knowledge/possible-distance-from-available-fuel (1), no-knowledge/possible-sums-not-possible-outcomes (1),
no-knowledge/pouring-with-no-loss (1), no-knowledge/precondition-for-an-operation (1), no-knowledge/prediction-in-a-stated-linear-model (1),
no-knowledge/preserve-the-same-concentration-when-scaling (1), no-knowledge/probability-by-complement (1), no-knowledge/probability-conditioned-on-color (1),
no-knowledge/probability-of-a-sum-from-two-simplified-coins (1), no-knowledge/probability-of-an-even-number (1), no-knowledge/production-at-a-constant-rate (1),
no-knowledge/proof-by-contradiction-in-an-interval (1), no-knowledge/proof-by-decomposing-area (1), no-knowledge/proof-by-enumerating-all-remainders (1),
no-knowledge/proof-by-intuitive-monotonicity (1), no-knowledge/proof-by-preserving-a-remainder (1), no-knowledge/proof-by-two-cases-even-or-odd (1),
no-knowledge/proof-of-uniqueness-by-comparison (1), no-knowledge/proof-using-a-lower-bound (1), no-knowledge/proof-using-an-upper-bound (1),
no-knowledge/proportional-table-with-the-same-rule (5), no-knowledge/prove-all-by-exhaustive-cases (1), no-knowledge/proving-that-two-formulas-give-the-same-result (1),
no-knowledge/range-as-maximum-minus-minimum (1), no-knowledge/rate-on-a-segment-from-a-table (1), no-knowledge/ratio-preserved-in-a-table (5),
no-knowledge/reconstruct-a-missing-frequency (1), no-knowledge/reconstruct-the-starting-state (5), no-knowledge/reconstructing-the-start-of-a-cycle (1),
no-knowledge/recovering-the-input-of-an-algorithm (5), no-knowledge/reflecting-a-route-in-a-vertical-mirror (1), no-knowledge/reflection-reverses-the-orientation-of-a-sequence (1),
no-knowledge/relative-frequency-from-data (1), no-knowledge/relative-position-from-two-relations (1), no-knowledge/remainder-upon-division-by-3-as-an-invariant (5),
no-knowledge/remaining-capacity (1), no-knowledge/repeated-measurement-and-a-suspicious-value (1), no-knowledge/reserve-for-unknown-demand (1),
no-knowledge/returning-along-exactly-the-same-route (1), no-knowledge/reversible-algorithm (1), no-knowledge/rotating-an-arrow-by-a-quarter-turn (1),
no-knowledge/rotating-directions-by-90 (1), no-knowledge/rounding-as-an-interval-of-possibilities (1), no-knowledge/rounding-to-the-nearest-hundred (5),
no-knowledge/route-on-a-grid (5), no-knowledge/route-robust-to-a-blockage (1), no-knowledge/rows-and-columns (5), no-knowledge/run-length-coding-and-when-it-compresses (1),
no-knowledge/run-length-coding-can-enlarge-a-message (1), no-knowledge/safety-reserve (1), no-knowledge/same-area-after-rearrangement-different-perimeter (1),
no-knowledge/same-area-different-perimeters (5), no-knowledge/same-portion-more-pieces (5), no-knowledge/same-quantity-different-groupings (5),
no-knowledge/sample-and-population-defined (1), no-knowledge/scaled-recipe (5), no-knowledge/scaling-and-area-counted-in-squares (1), no-knowledge/scaling-and-perimeter (1),
no-knowledge/scaling-defined-explicitly (1), no-knowledge/schedule-and-duration (5), no-knowledge/scheduling-four-tasks (5), no-knowledge/scheduling-tasks-on-one-machine (1),
no-knowledge/scheduling-with-an-optional-task (1), no-knowledge/search-in-a-sorted-list-by-halving (1), no-knowledge/sensors-and-majority-voting (1),
no-knowledge/shadow-in-a-stated-proportional-model (1), no-knowledge/sharing-with-a-condition (5), no-knowledge/shift-change-after-four-days (1),
no-knowledge/shortest-path-by-number-of-links (1), no-knowledge/shortest-path-in-a-state-space (5), no-knowledge/side-length-from-a-known-area (5),
no-knowledge/simple-prefix-code-and-decoding-without-a-separator (1), no-knowledge/sorting-by-selecting-the-minimum (1), no-knowledge/sorting-categories-by-value (1),
no-knowledge/speed-from-distance-and-time (1), no-knowledge/state-after-two-changes (5), no-knowledge/sticks-for-two-triangles-sharing-a-side (1),
no-knowledge/strategy-by-preserving-multiples-of-three (1), no-knowledge/strategy-with-information-before-acting (1), no-knowledge/sum-of-an-even-and-an-odd-number (1),
no-knowledge/sum-of-degrees-in-a-small-network (1), no-knowledge/supply-chain-with-a-minimum-capacity-bottleneck (1), no-knowledge/sustainability-threshold (1),
no-knowledge/symmetry-broken-by-a-mark (1), no-knowledge/symmetry-in-a-string (5), no-knowledge/temperature-as-a-position-on-a-scale (1),
no-knowledge/temperature-difference-across-zero (1), no-knowledge/test-order-changes-cost-not-the-result (1), no-knowledge/the-1-or-2-game-a-small-winning-position (1),
no-knowledge/the-add-2-machine (1), no-knowledge/the-add-3-machine (1), no-knowledge/the-add-4-machine (1), no-knowledge/the-add-5-machine (1), no-knowledge/the-add-6-machine (1),
no-knowledge/the-additional-question-that-is-needed (1), no-knowledge/the-and-condition-requires-both-rules (1), no-knowledge/the-balance-with-an-unknown-box (5),
no-knowledge/the-best-estimate-among-choices (1), no-knowledge/the-counterexample-that-refutes-all (1), no-knowledge/the-day-three-days-from-now (1),
no-knowledge/the-degree-of-a-node (1), no-knowledge/the-difference-between-two-bars (1), no-knowledge/the-even-odd-invariant (5),
no-knowledge/the-first-occurrence-after-a-threshold (1), no-knowledge/the-hidden-number-between-two-bounds (5), no-knowledge/the-inverse-translation (1),
no-knowledge/the-label-that-separates-two-objects (1), no-knowledge/the-missing-category-from-the-total (5), no-knowledge/the-missing-number-in-two-circles (1),
no-knowledge/the-model-does-not-allow-extrapolation-when-the-rule-changes (1), no-knowledge/the-opposite-corner-of-a-rectangle-on-a-grid (1),
no-knowledge/the-or-condition-allows-one-or-both (1), no-knowledge/the-order-of-clues-and-the-same-solution (1), no-knowledge/the-order-of-transformations-can-matter (1),
no-knowledge/the-pigeonhole-principle-as-a-proof (1), no-knowledge/the-question-that-halves-the-possibilities (1), no-knowledge/the-redundant-clue (1),
no-knowledge/the-same-probability-in-two-different-bags (1), no-knowledge/the-same-shape-after-a-translation (1), no-knowledge/the-second-test-becomes-decisive (1),
no-knowledge/the-shortest-instruction-sequence (1), no-knowledge/the-simplest-rule-is-not-guaranteed-to-be-true (1),
no-knowledge/the-smallest-amount-of-information-that-solves-the-puzzle (1), no-knowledge/the-smallest-bounding-region (1), no-knowledge/the-tallest-bar (1),
no-knowledge/the-union-of-two-events-by-counting (1), no-knowledge/the-unknown-term-in-a-chain (5), no-knowledge/there-exists-is-proved-by-a-witness (1),
no-knowledge/three-activities-and-a-free-window (1), no-knowledge/three-digit-code-and-positional-clues (5), no-knowledge/three-levels-of-grouping (5),
no-knowledge/three-properties-only-one-possible-object (1), no-knowledge/three-quantities-three-clues (5), no-knowledge/three-squares-in-a-row (1),
no-knowledge/time-from-distance-and-speed (1), no-knowledge/to-refute-there-exists-all-cases-must-be-eliminated (1), no-knowledge/total-and-a-multiplicative-relationship (5),
no-knowledge/total-by-day-from-a-two-way-table (1), no-knowledge/total-by-person-from-a-two-way-table (1), no-knowledge/transforming-a-pair-of-points (1),
no-knowledge/translation-by-a-vector-on-a-grid (1), no-knowledge/transport-in-multiple-trips (5), no-knowledge/traverse-each-link-exactly-once (1),
no-knowledge/two-activities-that-coincide (1), no-knowledge/two-adjacent-rectangles (5), no-knowledge/two-boxes-that-form-a-partition (1),
no-knowledge/two-boxes-with-a-given-difference (5), no-knowledge/two-cycles-with-different-phases (1), no-knowledge/two-descriptions-of-the-same-group (1),
no-knowledge/two-different-results (1), no-knowledge/two-different-routes-the-same-destination (1), no-knowledge/two-differently-shaped-containers-with-the-same-capacity (1),
no-knowledge/two-equal-categories (1), no-knowledge/two-figures-congruent-through-rigid-transformations (1), no-knowledge/two-fractions-of-the-same-total (5),
no-knowledge/two-independent-tasks-can-run-simultaneously (1), no-knowledge/two-instructions-meet-at-the-same-point (1), no-knowledge/two-intervals-that-do-not-overlap (1),
no-knowledge/two-intervals-that-overlap (1), no-knowledge/two-levels-of-packing (5), no-knowledge/two-machines-in-parallel (1), no-knowledge/two-machines-working-simultaneously (1),
no-knowledge/two-modes (1), no-knowledge/two-numbers-sum-and-difference (5), no-knowledge/two-opposing-processes-inflow-and-loss (1),
no-knowledge/two-properties-at-the-same-time (1), no-knowledge/two-segments-with-different-speeds (1), no-knowledge/two-separate-components (1),
no-knowledge/two-simplified-dice (1), no-knowledge/two-stages-with-fractions-different-reference-wholes (5), no-knowledge/two-successive-filters-on-a-table (1),
no-knowledge/two-successive-transfers (5), no-knowledge/two-tables-describing-the-same-data (1), no-knowledge/two-transformations-in-the-same-machine (5),
no-knowledge/two-translations-compose (1), no-knowledge/two-types-of-tickets (5), no-knowledge/two-ways-to-arrange-the-pieces (5), no-knowledge/undo-a-chain-of-three-operations (5),
no-knowledge/uniqueness-from-two-bounds-that-meet (1), no-knowledge/unknown-length-from-a-total (1), no-knowledge/unknown-side-from-the-perimeter (5),
no-knowledge/unsuccessful-search (1), no-knowledge/verify-a-checksum (1), no-knowledge/verifying-a-postcondition (1), no-knowledge/visit-all-nodes-without-repetition (1),
no-knowledge/volume-by-counting-cubes (1), no-knowledge/water-displacement-as-a-measure-of-object-volume (1), no-knowledge/water-level-and-added-volume (1),
no-knowledge/weighted-mean-defined-by-weights (1), no-knowledge/what-changes-under-reflection (1), no-knowledge/what-happens-when-we-reverse-the-digits (5),
no-knowledge/what-remains-unchanged-after-a-cut (1), no-knowledge/what-values-can-round-to-1200 (1), no-knowledge/what-values-can-round-to-2500 (1),
no-knowledge/what-values-can-round-to-3700 (1), no-knowledge/what-values-can-round-to-4800 (1), no-knowledge/what-values-can-round-to-6300 (1),
no-knowledge/when-does-a-tank-empty (1), no-knowledge/when-the-information-is-not-sufficient (1), no-knowledge/when-two-clues-say-the-same-thing (1),
no-knowledge/who-has-the-longest-object (5), no-knowledge/why-different-units-cannot-be-compared-directly (1), no-knowledge/why-sorting-helps-binary-search (1)


## Accepted by chapter

- chapter 1: 25
- chapter 2: 25
- chapter 3: 25
- chapter 4: 25
- chapter 5: 25
- chapter 6: 25
- chapter 7: 25
- chapter 8: 25
- chapter 9: 25
- chapter 10: 25
- chapter 11: 25
- chapter 12: 25
- chapter 13: 25
- chapter 14: 25
- chapter 15: 25
- chapter 16: 25
- chapter 17: 25
- chapter 18: 25
- chapter 19: 25
- chapter 20: 25
- chapter 21: 25
- chapter 22: 25
- chapter 23: 25
- chapter 24: 25
- chapter 25: 25
- chapter 26: 25
- chapter 27: 25
- chapter 28: 25
- chapter 29: 25
- chapter 30: 25
- chapter 31: 25
- chapter 32: 25
- chapter 33: 25
- chapter 34: 25
- chapter 35: 25
- chapter 36: 25
- chapter 37: 25
- chapter 38: 25
- chapter 39: 25
- chapter 40: 25

## Rejected by reason


## Answers not shipped as printed


5 accepted examples ship a normalized answer because the source prints it in a form the English-only policy cannot ship; the source registration declares the equivalent:
- remainder-upon-division-by-3-as-an-invariant: 5 examples

## Family integrity checks

Templates covered: 610, of which 98 have several variants and 97 of those print several distinct answers, which is what shows that the computation reacts to its input.

Templates whose variants all print one answer, so the variants do not test recomputation:
- Maximum, Minimum, and Ties (5 variants, one printed answer)

## Text blemishes

The source itself prints these missing-space artifacts around digits (a word glued to a digit); the extraction is faithful and does not repair them:
- 28.14: or2
- 28.17: and2
- 28.18: and2
- 31.8: or1
- 31.18: and3
- 31.19: of6
- 31.19: of1
- 31.21: and2
- 31.22: and1

## Limitations

- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.
- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.
- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.
- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.
- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.
