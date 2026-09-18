# Explanation 5.2.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 59 catchment observations × 0.75 = 44.25 standard units.
2. Adjusting for the 15% loss, enough input must be supplied for 44.25 / 0.85 = 52.06 standard units.
3. Discretizing that need into containers of 23 standard units gives ceil(52.06/23) = 3 capacity units.
4. Comparing with the 7 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 3 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
