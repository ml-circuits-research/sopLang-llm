# Explanation 38.3 — Build the binary code for a value

## Explanation

1. Taking the largest weights first and including one whenever it still fits builds the code greedily: 4 fits into 6, so the first bit is 1.
2. The remaining amount is then tested against 2 and against 1 in turn.
3. The greedy choices leave nothing over and produce the code 110.

Reference solution as printed in the source (chapter 38, 4 steps):

1. To form 6, include 4.
2. 2 remains, so include 2 as well.
3. We no longer need 1.
4. The bits are 1, 1, 0.

## Result

**Answer.** 110.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
