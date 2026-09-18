# Explanation 7.1.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 90 sources × 0.75 = 67.5 standard units.
2. Adjusting for the 15% loss, enough input must be supplied for 67.5 / 0.85 = 79.41 standard units.
3. Discretizing that need into containers of 17 standard units gives ceil(79.41/17) = 5 capacity units.
4. Comparing with the 4 available containers makes the plan not feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 5 capacity units and is not feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
