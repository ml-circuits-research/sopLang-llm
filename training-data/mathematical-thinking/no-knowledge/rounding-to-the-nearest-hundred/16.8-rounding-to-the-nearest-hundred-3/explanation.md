# Explanation 16.8 — Rounding to the Nearest Hundred 3

## Explanation

1. The statement gives the rule: measure the distance to each neighbouring hundred and keep the closer one; a value exactly halfway is assigned to the upper hundred.
2. 3511 is 11 above 3500 and 89 below 3600.
3. The smaller distance is 11, so the nearest hundred is 3500.

Reference solution as printed in the source (chapter 16, 3 steps):

1. Distance to 3500: 3511-3500=11.
2. Distance to 3600: 3600-3511=89.
3. Since 11<89, choose 3500.

## Result

**Answer.** 3500

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
