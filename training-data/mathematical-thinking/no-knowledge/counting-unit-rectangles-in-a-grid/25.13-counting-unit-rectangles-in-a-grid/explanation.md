# Explanation 25.13 — Counting unit rectangles in a grid

## Explanation

1. A grid of 2 rows holds 3 unit cells in each row.
2. The unit cells are disjoint and together fill the grid, so their number is the product of the two dimensions.
3. There are 6 unit rectangular cells.

Reference solution as printed in the source (chapter 25, 4 steps):

1. Each row contains 3 cells.
2. There are 2 rows.
3. 3+3=6, equivalently 2×3.
4. We are counting unit cells, not all rectangles of different sizes.

## Result

**Answer.** 6 cells.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
