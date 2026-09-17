# Explanation 16.6 — Rounding to the Nearest Hundred 1

## Explanation

1. The statement gives the rule: measure the distance to each neighbouring hundred and keep the closer one; a value exactly halfway is assigned to the upper hundred.
2. 1462 is 62 above 1400 and 38 below 1500.
3. The smaller distance is 38, so the nearest hundred is 1500.

Reference solution as printed in the source (chapter 16, 3 steps):

1. Distance to 1400: 1462-1400=62.
2. Distance to 1500: 1500-1462=38.
3. Since 38<62, choose 1500.

## Result

**Answer.** 1500

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
