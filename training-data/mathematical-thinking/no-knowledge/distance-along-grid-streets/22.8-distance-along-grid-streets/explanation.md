# Explanation 22.8 — Distance along grid streets

## Explanation

1. With streets only east-west and north-south, every route must cover each east-west block and each north-south block at least once.
2. Adding the two independent distances gives the minimum of 5 unit street segments.

Reference solution as printed in the source (chapter 22, 4 steps):

1. You must cover 3 blocks in the east-west direction.
2. You must also cover 2 blocks in the north-south direction.
3. One allowed step cannot solve both coordinate differences at once because diagonals are forbidden.
4. Therefore the minimum is 3+2=5 unit segments.

## Result

**Answer.** 5 unit street segments.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
