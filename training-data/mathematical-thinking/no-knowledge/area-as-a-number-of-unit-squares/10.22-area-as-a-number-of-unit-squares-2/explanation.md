# Explanation 10.22 — Area as a Number of Unit Squares 2

## Explanation

1. The figure is covered without gaps or overlaps by 4 rows of 6 identical squares.
2. The definition of the area in unit squares counts exactly those covering squares.
3. Each row holds 6 squares, and there are 4 rows, so the count is 4 · 6.
4. The area is 24 unit squares.

Reference solution as printed in the source (chapter 10, 2 steps):

1. Each row has 6 squares.
2. There are 4 rows, so 4×6=24 unit squares.

## Result

**Answer.** 24 unit squares.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
