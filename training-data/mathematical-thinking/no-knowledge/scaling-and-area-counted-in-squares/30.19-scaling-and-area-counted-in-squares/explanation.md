# Explanation 30.19 — Scaling and area counted in squares

## Explanation

1. The 2×2 square holds 4 unit cells, so the cell count is the product of the two dimensions.
2. The doubled square is 4×4, which holds 4 × 4 = 16 cells.
3. Comparing 16 with 4 gives 4 times as many cells.

Reference solution as printed in the source (chapter 30, 4 steps):

1. The initial area is 2×2=4.
2. After doubling, the dimensions are 4 and 4.
3. The new area is 16.
4. 16 is 4 times 4; doubling both directions creates four copies of the original area.

## Result

**Answer.** 16 cells, 4 times as many.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
