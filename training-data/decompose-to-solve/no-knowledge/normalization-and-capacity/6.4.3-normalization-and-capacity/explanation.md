# Explanation 6.4.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 107 votes or seats × 1.5 = 160.5 standard units.
2. Adjusting for the 12% loss, enough input must be supplied for 160.5 / 0.88 = 182.39 standard units.
3. Discretizing that need into containers of 14 standard units gives ceil(182.39/14) = 14 capacity units.
4. Comparing with the 10 available containers makes the plan not feasible; the color-coding note does not affect capacity.
5. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Source answer.** The operation needs 14 capacity units and is not feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** 14 capacity units: not feasible.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
