# Explanation 38.5 — Even parity bit

## Explanation

1. The check bit must make the total number of 1-bits even.
2. The message 101 already has 2 ones, so the check bit is 0.
3. Adding 0 leaves the count unchanged and it stays even.

Reference solution as printed in the source (chapter 38, 4 steps):

1. The message 101 contains two 1-bits.
2. Two is even.
3. Adding a 0 does not change the number of 1s.
4. The check bit is 0.

## Result

**Answer.** 0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
