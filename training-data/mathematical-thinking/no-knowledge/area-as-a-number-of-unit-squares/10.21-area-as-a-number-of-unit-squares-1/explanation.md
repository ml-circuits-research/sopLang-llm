# Explanation 10.21 — Area as a Number of Unit Squares 1

## Explanation

1. The figure is covered without gaps or overlaps by 3 rows of 5 identical squares.
2. The definition of the area in unit squares counts exactly those covering squares.
3. Each row holds 5 squares, and there are 3 rows, so the count is 3 · 5.
4. The area is 15 unit squares.

Reference solution as printed in the source (chapter 10, 2 steps):

1. Each row has 5 squares.
2. There are 3 rows, so 3×5=15 unit squares.

## Result

**Answer.** 15 unit squares.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
