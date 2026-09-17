# Explanation 12.17 — Same Portion, More Pieces 2

## Explanation

1. The figure starts with 2/3 colored, so the whole has 3 parts and 2 of them are colored.
2. Dividing every part into 2 equal pieces multiplies the number of parts by 2 without changing which region is colored.
3. Both counts are multiplied by the same number, so the fraction becomes (2·2)/(3·2) = 4/6.

Reference solution as printed in the source (chapter 12, 3 steps):

1. The total number of pieces becomes 3×2=6.
2. The number of colored pieces becomes 2×2=4.
3. The new fraction is 4/6, representing the same portion of the whole.

## Result

**Answer.** 4/6

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
