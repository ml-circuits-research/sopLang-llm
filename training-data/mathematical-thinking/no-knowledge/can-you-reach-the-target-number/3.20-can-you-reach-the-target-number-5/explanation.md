# Explanation 3.20 — Can You Reach the Target Number? 5

## Explanation

1. Every move adds exactly 2, so after any number of moves the count is 16 plus a multiple of 2.
2. That property is the invariant: the count stays paired all the way, and it can never become an odd number.
3. 21 differs from 16 by 5, which is not a whole multiple of 2, so no number of moves lands exactly on 21.
4. The invariant explains the answer without trying move after move.

Reference solution as printed in the source (chapter 3, 4 steps):

1. 16 is made entirely of pairs.
2. Every move adds another pair, so after any number of moves the quantity can still be formed entirely from pairs.
3. 21 leaves one token unpaired; it is 5 greater than a number that can be formed entirely from pairs.
4. Therefore the target cannot be reached using only +2 moves.

## Result

**Answer.** No, 21 cannot be reached.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
