# Explanation 12.19 — Same Portion, More Pieces 4

## Explanation

1. The figure starts with 2/5 colored, so the whole has 5 parts and 2 of them are colored.
2. Dividing every part into 3 equal pieces multiplies the number of parts by 3 without changing which region is colored.
3. Both counts are multiplied by the same number, so the fraction becomes (2·3)/(5·3) = 6/15.

Reference solution as printed in the source (chapter 12, 3 steps):

1. The total number of pieces becomes 5×3=15.
2. The number of colored pieces becomes 2×3=6.
3. The new fraction is 6/15, representing the same portion of the whole.

## Result

**Answer.** 6/15

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
