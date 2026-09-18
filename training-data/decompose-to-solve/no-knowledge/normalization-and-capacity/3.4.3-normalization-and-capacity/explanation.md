# Explanation 3.4.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 52 servings × 0.75 = 39 standard units.
2. Adjusting for the 5% loss, enough input must be supplied for 39 / 0.95 = 41.05 standard units.
3. Discretizing that need into containers of 27 standard units gives ceil(41.05/27) = 2 capacity units.
4. Comparing with the 5 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 2 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
