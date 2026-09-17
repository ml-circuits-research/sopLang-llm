# Explanation 38.4 — Largest value with three bits

## Explanation

1. The largest value is reached when every bit is 1, because each 1 adds its weight while each 0 adds nothing.
2. Adding all the weights (4 + 2 + 1) gives 7.

Reference solution as printed in the source (chapter 38, 4 steps):

1. For the maximum, use 1 in every position.
2. Add all the weights.
3. 4+2+1=7.
4. No code can include more than all the weights.

## Result

**Answer.** 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
