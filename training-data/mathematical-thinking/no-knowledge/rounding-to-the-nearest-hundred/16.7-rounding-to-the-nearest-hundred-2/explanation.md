# Explanation 16.7 — Rounding to the Nearest Hundred 2

## Explanation

1. The statement gives the rule: measure the distance to each neighbouring hundred and keep the closer one; a value exactly halfway is assigned to the upper hundred.
2. 2738 is 38 above 2700 and 62 below 2800.
3. The smaller distance is 38, so the nearest hundred is 2700.

Reference solution as printed in the source (chapter 16, 3 steps):

1. Distance to 2700: 2738-2700=38.
2. Distance to 2800: 2800-2738=62.
3. Since 38<62, choose 2700.

## Result

**Answer.** 2700

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
