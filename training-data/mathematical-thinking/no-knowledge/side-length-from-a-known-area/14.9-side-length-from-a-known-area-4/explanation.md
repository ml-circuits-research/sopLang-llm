# Explanation 14.9 — Side Length from a Known Area 4

## Explanation

1. The statement gives the rule area = number of rows × number of squares per row, so the unknown is the number of rows.
2. The rectangle covers 45 unit squares and every row holds 15 of them, so the rows are the missing factor of the product.
3. Dividing the area by the row length recovers that factor: 45 ÷ 15.

Reference solution as printed in the source (chapter 14, 3 steps):

1. Divide the 45 squares into rows of 15.
2. 45÷15=3.
3. Therefore, the other side is 3 units long.

## Result

**Answer.** 3

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
