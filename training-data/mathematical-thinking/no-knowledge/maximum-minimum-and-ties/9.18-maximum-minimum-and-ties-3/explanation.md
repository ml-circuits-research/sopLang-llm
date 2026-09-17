# Explanation 9.18 — Maximum, Minimum, and Ties 3

## Explanation

1. The frequencies are A=7, B=10, C=10, and D=5.
2. The largest value is 10, and a category counts as maximum whenever no other category exceeds it, so ties are kept together.
3. Categories B and C share that largest value and are all maxima.
4. The smallest value is 5 and belongs only to D, which is the minimum.

Reference solution as printed in the source (chapter 9, 3 steps):

1. The largest value is 10.
2. Both B and C have this value, so both are maxima.
3. The smallest value is 5, at D.

## Result

**Answer.** Maxima: B and C; minimum: D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
