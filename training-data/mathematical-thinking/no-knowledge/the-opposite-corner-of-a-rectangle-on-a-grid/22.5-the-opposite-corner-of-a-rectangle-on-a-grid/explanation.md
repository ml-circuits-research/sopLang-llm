# Explanation 22.5 — The opposite corner of a rectangle on a grid

## Explanation

1. Rows are numbered downward, so moving down from row 2 by the rectangle height reaches row 5; columns grow to the right, so moving across by the width reaches column 7.
2. The bottom-right corner therefore sits at (row 5, column 7).

Reference solution as printed in the source (chapter 22, 4 steps):

1. Starting from row 2 and moving down 3 rows gives row 5.
2. Starting from column 3 and moving right 4 columns gives column 7.
3. The row and column changes can be calculated independently.
4. The opposite corner is therefore at (5,7).

## Result

**Answer.** (row 5, column 7).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
