# Explanation 18.17 — Grid Positions: Row and Column 2

## Explanation

1. A position is written as (row, column), so the two coordinates are tracked separately.
2. The row move of -2 changes only the first coordinate: 4 + -2 = 2.
3. The column move of 4 changes only the second coordinate: 2 + 4 = 6.
4. Combining the two independent moves gives the final position (2,6).

Reference solution as printed in the source (chapter 18, 3 steps):

1. New row: 4-2=2.
2. New column: 2+4=6.
3. The final position is (2,6).

## Result

**Answer.** (2,6)

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
