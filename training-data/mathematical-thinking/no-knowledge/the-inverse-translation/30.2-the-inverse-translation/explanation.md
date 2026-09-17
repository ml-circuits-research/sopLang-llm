# Explanation 30.2 — The inverse translation

## Explanation

1. The forward motion adds 3 to the column and ends at column 9.
2. Undoing it is the inverse operation, so the initial column was 9 − 3 = 6.

Reference solution as printed in the source (chapter 30, 4 steps):

1. The translation adds 3.
2. To reverse it, subtract 3.
3. 9−3=6.
4. Check: 6+3=9.

## Result

**Answer.** Column 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
