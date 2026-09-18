# Explanation 2.1.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 80 connections × 0.5 = 40 standard units.
2. Adjusting for the 12% loss, enough input must be supplied for 40 / 0.88 = 45.45 standard units.
3. Discretizing that need into containers of 13 standard units gives ceil(45.45/13) = 4 capacity units.
4. Comparing with the 6 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 4 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
