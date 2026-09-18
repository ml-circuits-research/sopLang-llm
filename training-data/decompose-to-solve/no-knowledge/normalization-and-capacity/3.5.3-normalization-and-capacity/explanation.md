# Explanation 3.5.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 51 budget items × 2 = 102 standard units.
2. Adjusting for the 15% loss, enough input must be supplied for 102 / 0.85 = 120 standard units.
3. Discretizing that need into containers of 23 standard units gives ceil(120/23) = 6 capacity units.
4. Comparing with the 7 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 6 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
