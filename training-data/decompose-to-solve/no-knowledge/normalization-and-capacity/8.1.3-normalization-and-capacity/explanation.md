# Explanation 8.1.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 73 network links × 0.5 = 36.5 standard units.
2. Adjusting for the 10% loss, enough input must be supplied for 36.5 / 0.9 = 40.56 standard units.
3. Discretizing that need into containers of 12 standard units gives ceil(40.56/12) = 4 capacity units.
4. Comparing with the 7 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 4 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
