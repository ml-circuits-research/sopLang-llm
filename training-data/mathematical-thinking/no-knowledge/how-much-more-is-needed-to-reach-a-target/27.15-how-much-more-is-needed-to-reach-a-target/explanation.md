# Explanation 27.15 — How much more is needed to reach a target

## Explanation

1. The collected values 7 and 6 form the running part of the target 20.
2. Subtracting them leaves 7 points, which is what the last day must add to reach the target exactly.

Reference solution as printed in the source (chapter 27, 4 steps):

1. The first two days give 13.
2. The target is 20.
3. The difference is 20−13=7.
4. With 7 on day three, the total becomes 20.

## Result

**Answer.** 7 points.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
