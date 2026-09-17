# Explanation 9.16 — Maximum, Minimum, and Ties 1

## Explanation

1. The frequencies are A=5, B=8, C=8, and D=3.
2. The largest value is 8, and a category counts as maximum whenever no other category exceeds it, so ties are kept together.
3. Categories B and C share that largest value and are all maxima.
4. The smallest value is 3 and belongs only to D, which is the minimum.

Reference solution as printed in the source (chapter 9, 3 steps):

1. The largest value is 8.
2. Both B and C have this value, so both are maxima.
3. The smallest value is 3, at D.

## Result

**Answer.** Maxima: B and C; minimum: D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
