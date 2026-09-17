# Explanation 18.20 — Grid Positions: Row and Column 5

## Explanation

1. A position is written as (row, column), so the two coordinates are tracked separately.
2. The row move of -1 changes only the first coordinate: 6 + -1 = 5.
3. The column move of 3 changes only the second coordinate: 4 + 3 = 7.
4. Combining the two independent moves gives the final position (5,7).

Reference solution as printed in the source (chapter 18, 3 steps):

1. New row: 6-1=5.
2. New column: 4+3=7.
3. The final position is (5,7).

## Result

**Answer.** (5,7)

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
