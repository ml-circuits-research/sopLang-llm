# Explanation 6.3.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 127 institutional actions × 1.25 = 158.75 standard units.
2. Adjusting for the 10% loss, enough input must be supplied for 158.75 / 0.9 = 176.39 standard units.
3. Discretizing that need into containers of 24 standard units gives ceil(176.39/24) = 8 capacity units.
4. Comparing with the 10 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 8 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
