# Explanation 8.9.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 109 test cases × 1.25 = 136.25 standard units.
2. Adjusting for the 8% loss, enough input must be supplied for 136.25 / 0.92 = 148.1 standard units.
3. Discretizing that need into containers of 25 standard units gives ceil(148.1/25) = 6 capacity units.
4. Comparing with the 8 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 6 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
