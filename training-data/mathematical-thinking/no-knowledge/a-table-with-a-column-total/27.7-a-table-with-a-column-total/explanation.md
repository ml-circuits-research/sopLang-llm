# Explanation 27.7 — A table with a column total

## Explanation

1. A column total is read down the column, so the printed classes plus the missing one must equal 16.
2. The printed classes add up to 12, so C contributes the remaining 4.

Reference solution as printed in the source (chapter 27, 4 steps):

1. The first two classes give 12.
2. Tuesday's total is 16.
3. The missing amount is 16−12=4.
4. Therefore C=4.

## Result

**Answer.** 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
