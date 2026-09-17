# Explanation 31.13 — Drawing with replacement: the composition remains

## Explanation

1. Returning the ball restores the bag to its original composition, so the second draw sees exactly the same bag as the first.
2. The bag still holds 2 red and 1 blue balls when the second draw is made.
3. The chance of red is 2 of 3, that is 2/3, the same as before.

Reference solution as printed in the source (chapter 31, 4 steps):

1. The first ball is returned.
2. The bag returns exactly to its initial state.
3. There are again 2 red balls among 3.
4. The probability is 2/3.

## Result

**Answer.** 2/3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
