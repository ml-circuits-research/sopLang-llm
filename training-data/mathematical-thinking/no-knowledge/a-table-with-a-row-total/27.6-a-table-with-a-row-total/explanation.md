# Explanation 27.6 — A table with a row total

## Explanation

1. A row total is the sum of the cells in that row, so the total is fixed and only the missing cell is unknown.
2. The printed cells add up to 10 and the row total is 15, so the row must contain 5 plums.

Reference solution as printed in the source (chapter 27, 4 steps):

1. The known values sum to 10.
2. The row total is 15.
3. Plums=15−10=5.
4. The three categories then sum to 15.

## Result

**Answer.** 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
