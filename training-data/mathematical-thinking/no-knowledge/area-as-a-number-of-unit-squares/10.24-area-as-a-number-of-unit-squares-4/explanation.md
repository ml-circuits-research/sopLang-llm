# Explanation 10.24 — Area as a Number of Unit Squares 4

## Explanation

1. The figure is covered without gaps or overlaps by 2 rows of 8 identical squares.
2. The definition of the area in unit squares counts exactly those covering squares.
3. Each row holds 8 squares, and there are 2 rows, so the count is 2 · 8.
4. The area is 16 unit squares.

Reference solution as printed in the source (chapter 10, 2 steps):

1. Each row has 8 squares.
2. There are 2 rows, so 2×8=16 unit squares.

## Result

**Answer.** 16 unit squares.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
