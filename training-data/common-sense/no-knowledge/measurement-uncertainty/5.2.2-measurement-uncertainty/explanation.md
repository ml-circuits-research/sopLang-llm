# Explanation 5.2.2 — Measurement uncertainty

## Explanation

1. A lies in 56.4 ± 2.5 = [53.9, 58.9], and B lies in 60 ± 1 = [59, 61].
2. The notation fixes only an interval for each true value; it states nothing about which values inside the interval are more likely.
3. Because the intervals do not overlap at all — B's lower endpoint 59 lies beyond the other's upper endpoint 58.9 — every allowed true value of B exceeds every allowed true value of the other measurement.
4. Comparing the two central values alone would ignore the stated errors and would report an order the data do not support.

Reference solution as printed in the source (template 13, 3 steps):

1. A lies in [53.9, 58.9].
2. B lies in [59, 61].
3. The intervals do not overlap, so every allowed value preserves the order B > A.

## Result

**Answer.** B is certainly greater than A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
