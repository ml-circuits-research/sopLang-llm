# Explanation 10.2.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 53 museum work packages × 1.5 = 79.5 standard units.
2. Adjusting for the 5% loss, enough input must be supplied for 79.5 / 0.95 = 83.68 standard units.
3. Discretizing that need into containers of 13 standard units gives ceil(83.68/13) = 7 capacity units.
4. Comparing with the 4 available containers makes the plan not feasible; the color-coding note does not affect capacity.
5. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Source answer.** The operation needs 7 capacity units and is not feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** 7 capacity units: not feasible.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
