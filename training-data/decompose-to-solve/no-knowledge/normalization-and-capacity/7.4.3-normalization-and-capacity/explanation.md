# Explanation 7.4.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 97 data points × 0.5 = 48.5 standard units.
2. Adjusting for the 8% loss, enough input must be supplied for 48.5 / 0.92 = 52.72 standard units.
3. Discretizing that need into containers of 14 standard units gives ceil(52.72/14) = 4 capacity units.
4. Comparing with the 4 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 4 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
