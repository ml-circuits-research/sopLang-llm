# Explanation 6.10.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 128 institutional commitments × 0.5 = 64 standard units.
2. Adjusting for the 10% loss, enough input must be supplied for 64 / 0.9 = 71.11 standard units.
3. Discretizing that need into containers of 13 standard units gives ceil(71.11/13) = 6 capacity units.
4. Comparing with the 10 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 6 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
