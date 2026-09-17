# Explanation 14.7 — Side Length from a Known Area 2

## Explanation

1. The statement gives the rule area = number of rows × number of squares per row, so the unknown is the number of rows.
2. The rectangle covers 60 unit squares and every row holds 12 of them, so the rows are the missing factor of the product.
3. Dividing the area by the row length recovers that factor: 60 ÷ 12.

Reference solution as printed in the source (chapter 14, 3 steps):

1. Divide the 60 squares into rows of 12.
2. 60÷12=5.
3. Therefore, the other side is 5 units long.

## Result

**Answer.** 5

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
