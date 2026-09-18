# Explanation 1.6.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 127 event tasks × 0.75 = 95.25 standard units.
2. Adjusting for the 10% loss, enough input must be supplied for 95.25 / 0.9 = 105.83 standard units.
3. Discretizing that need into containers of 19 standard units gives ceil(105.83/19) = 6 capacity units.
4. Comparing with the 7 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 6 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
