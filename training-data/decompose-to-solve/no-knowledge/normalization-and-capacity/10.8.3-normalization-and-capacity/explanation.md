# Explanation 10.8.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 97 data sets × 1.25 = 121.25 standard units.
2. Adjusting for the 12% loss, enough input must be supplied for 121.25 / 0.88 = 137.78 standard units.
3. Discretizing that need into containers of 14 standard units gives ceil(137.78/14) = 10 capacity units.
4. Comparing with the 8 available containers makes the plan not feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 10 capacity units and is not feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
