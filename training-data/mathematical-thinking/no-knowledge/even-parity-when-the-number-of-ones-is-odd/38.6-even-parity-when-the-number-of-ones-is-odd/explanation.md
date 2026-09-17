# Explanation 38.6 — Even parity when the number of ones is odd

## Explanation

1. The message 111 has 3 ones, which is an odd count.
2. A check bit of 1 adds one more 1 and makes the total even, so the bit to add is 1.

Reference solution as printed in the source (chapter 38, 4 steps):

1. There are 3 one-bits.
2. We need an even total.
3. Adding 1 brings the total to 4.
4. The check bit is 1.

## Result

**Answer.** 1.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
