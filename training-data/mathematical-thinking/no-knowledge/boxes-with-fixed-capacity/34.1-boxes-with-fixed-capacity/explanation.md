# Explanation 34.1 — Boxes with fixed capacity

## Explanation

1. A box holds at most 6, so each full box takes 6 of the 17 books.
2. Dividing 17 by 6 leaves a remainder, and a partly filled box still counts as a box.
3. Rounding the division up gives 3 boxes, because one box fewer would leave books unpacked.

Reference solution as printed in the source (chapter 34, 4 steps):

1. Two boxes can hold at most 12 books.
2. 17>12, so two are insufficient.
3. Three boxes can hold up to 18.
4. The distribution 6+6+5 is possible, so 3 is the minimum.

## Result

**Answer.** 3 boxes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
