# Explanation 38.12 — Fixed-length code and number of messages

## Explanation

1. Each of the 3 positions is independent and can be 0 or 1, so the number of messages doubles with every position.
2. That gives 2 to the power 3, which is 8 different messages.

Reference solution as printed in the source (chapter 38, 4 steps):

1. Each position has 2 options.
2. The choices are independent.
3. 2×2×2=8.
4. The codes range from 000 to 111.

## Result

**Answer.** 8 messages.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
