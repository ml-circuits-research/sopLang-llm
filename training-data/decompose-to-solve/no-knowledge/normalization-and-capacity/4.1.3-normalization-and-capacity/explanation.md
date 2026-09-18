# Explanation 4.1.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 49 measurements × 2 = 98 standard units.
2. Adjusting for the 8% loss, enough input must be supplied for 98 / 0.92 = 106.52 standard units.
3. Discretizing that need into containers of 24 standard units gives ceil(106.52/24) = 5 capacity units.
4. Comparing with the 7 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 5 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
