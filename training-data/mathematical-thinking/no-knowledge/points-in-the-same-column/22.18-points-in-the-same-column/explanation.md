# Explanation 22.18 — Points in the same column

## Explanation

1. A column is fixed by the second coordinate, so two points share a column exactly when their second coordinates are equal.
2. Comparing the second coordinates leaves only P and Q, which both lie in column 5.

Reference solution as printed in the source (chapter 22, 4 steps):

1. P has column coordinate 5.
2. Q also has column coordinate 5.
3. R has column coordinate 7.
4. Therefore P and Q are in the same column.

## Result

**Answer.** P and Q.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
