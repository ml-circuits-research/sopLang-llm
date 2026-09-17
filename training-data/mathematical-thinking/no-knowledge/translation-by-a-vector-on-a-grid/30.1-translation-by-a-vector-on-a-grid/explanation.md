# Explanation 30.1 — Translation by a vector on a grid

## Explanation

1. The point starts at column 3 and row 2 in the (row, column) convention of the problem.
2. Moving 4 columns right adds 4 to the column, and moving 1 rows up subtracts 1 from the row because the problem states that up decreases the row number.
3. The new position is (1,7).

Reference solution as printed in the source (chapter 30, 4 steps):

1. Row 2 decreases by 1 and becomes 1.
2. Column 3 increases by 4 and becomes 7.
3. Both changes apply to the same point.
4. The new position is (1,7).

## Result

**Answer.** (1,7).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
