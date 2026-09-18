# Explanation 6.7.3 — Normalization and Capacity

## Explanation

1. Normalizing first: 99 artworks × 1.25 = 123.75 standard units.
2. Adjusting for the 12% loss, enough input must be supplied for 123.75 / 0.88 = 140.63 standard units.
3. Discretizing that need into containers of 24 standard units gives ceil(140.63/24) = 6 capacity units.
4. Comparing with the 7 available containers makes the plan feasible; the color-coding note does not affect capacity.

## Result

**Answer.** The operation needs 6 capacity units and is feasible. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
