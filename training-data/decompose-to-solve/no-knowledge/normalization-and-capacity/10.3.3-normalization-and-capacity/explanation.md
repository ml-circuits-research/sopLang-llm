# Explanation 10.3.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 71 field activities × 2 = 142 standard units.
2. Adjusting for the 15% loss, enough input must be supplied for 142 / 0.85 = 167.06 standard units.
3. Discretizing that need into containers of 25 standard units gives ceil(167.06/25) = 7 capacity units.
4. Comparing with the 7 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 7 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
