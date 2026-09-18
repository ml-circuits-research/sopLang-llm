# Explanation 2.2.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 98 construction tasks × 2 = 196 standard units.
2. Adjusting for the 12% loss, enough input must be supplied for 196 / 0.88 = 222.73 standard units.
3. Discretizing that need into containers of 28 standard units gives ceil(222.73/28) = 8 capacity units.
4. Comparing with the 7 available containers makes the plan not feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 8 capacity units and is not feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
