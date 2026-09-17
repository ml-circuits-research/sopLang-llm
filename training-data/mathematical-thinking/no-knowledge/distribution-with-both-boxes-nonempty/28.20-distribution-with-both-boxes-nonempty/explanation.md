# Explanation 28.20 — Distribution with both boxes nonempty

## Explanation

1. Allowing empty boxes gives 2^2 distributions, but the problem requires every box to receive a ball.
2. Removing the assignments that leave a box empty, by inclusion and exclusion over the empty boxes, keeps only the distributions that use all boxes.
3. With 2 balls and 2 boxes, 2 distributions remain.

Reference solution as printed in the source (chapter 28, 4 steps):

1. There are 4 total distributions.
2. AA leaves B empty; BB leaves A empty.
3. AB and BA use both boxes.
4. 2 remain.

## Result

**Answer.** 2 distributions.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
