# Explanation 2.3.5 — Measurement uncertainty

## Explanation

1. A lies in 70 ± 2 = [68, 72], and B lies in 71.1 ± 1.5 = [69.6, 72.6].
2. The notation fixes only an interval for each true value; it states nothing about which values inside the interval are more likely.
3. Because the intervals overlap, some allowed true values have A ≥ B and others have B ≥ A, so the ordering cannot be established with certainty.
4. Comparing the two central values alone would ignore the stated errors and would report an order the data do not support.

Reference solution as printed in the source (template 13, 3 steps):

1. A lies in [68, 72].
2. B lies in [69.6, 72.6].
3. The intervals overlap, so allowed values exist with A≥B and others with B≥A. The central values alone cannot determine the order.

## Result

**Answer.** The ordering cannot be established with certainty because the intervals overlap.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
