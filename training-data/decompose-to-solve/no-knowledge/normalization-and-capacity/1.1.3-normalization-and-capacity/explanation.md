# Explanation 1.1.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 96 observations × 1.25 = 120 standard units.
2. Adjusting for the 15% loss, enough input must be supplied for 120 / 0.85 = 141.18 standard units.
3. Discretizing that need into containers of 16 standard units gives ceil(141.18/16) = 9 capacity units.
4. Comparing with the 4 available containers makes the plan not feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 9 capacity units and is not feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
