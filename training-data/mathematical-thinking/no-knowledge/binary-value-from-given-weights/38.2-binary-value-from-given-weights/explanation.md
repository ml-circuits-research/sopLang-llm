# Explanation 38.2 — Binary value from given weights

## Explanation

1. Each position carries a weight (4, 2, 1), and a bit says whether that weight is included.
2. Multiplying every bit of 101 by its weight and adding the results gives 5.
3. A bit equal to 0 contributes nothing, so only the positions with 1 count.

Reference solution as printed in the source (chapter 38, 4 steps):

1. The first 1 includes 4.
2. The 0 does not include 2.
3. The last 1 includes 1.
4. 4+1=5.

## Result

**Answer.** 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
