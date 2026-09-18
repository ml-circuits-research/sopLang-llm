# Explanation 10.7.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 124 restoration tasks × 0.75 = 93 standard units.
2. Adjusting for the 12% loss, enough input must be supplied for 93 / 0.88 = 105.68 standard units.
3. Discretizing that need into containers of 19 standard units gives ceil(105.68/19) = 6 capacity units.
4. Comparing with the 10 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 6 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
