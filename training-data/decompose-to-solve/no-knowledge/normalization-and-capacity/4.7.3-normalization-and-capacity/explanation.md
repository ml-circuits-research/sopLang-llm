# Explanation 4.7.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 92 field observations × 0.75 = 69 standard units.
2. Adjusting for the 5% loss, enough input must be supplied for 69 / 0.95 = 72.63 standard units.
3. Discretizing that need into containers of 15 standard units gives ceil(72.63/15) = 5 capacity units.
4. Comparing with the 6 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 5 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
