# Explanation 6.8.2 — Measurement uncertainty

## Explanation

1. A lies in 51.7 ± 2 = [49.7, 53.7], and B lies in 51.4 ± 2 = [49.4, 53.4].
2. The notation fixes only an interval for each true value; it states nothing about which values inside the interval are more likely.
3. Because the intervals overlap, some allowed true values have A ≥ B and others have B ≥ A, so the ordering cannot be established with certainty.
4. Comparing the two central values alone would ignore the stated errors and would report an order the data do not support.

Reference solution as printed in the source (template 13, 3 steps):

1. A lies in [49.7, 53.7].
2. B lies in [49.4, 53.4].
3. The intervals overlap, so allowed values exist with A≥B and others with B≥A. The central values alone cannot determine the order.

## Result

**Answer.** The ordering cannot be established with certainty because the intervals overlap.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
