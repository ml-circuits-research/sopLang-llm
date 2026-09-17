# Explanation 3.11 — Two Ways to Arrange the Pieces 1

## Explanation

1. An arrangement is possible exactly when repeatedly taking groups of the required size leaves no piece over, which is the same as the remainder being zero.
2. For rows of 2, 12 splits into 6 rows because 6 × 2 = 12.
3. For rows of 3, 12 splits into 4 rows because 4 × 3 = 12.
4. Both remainders are zero, so the claim is confirmed and the numbers of rows differ because the row sizes differ.

Reference solution as printed in the source (chapter 3, 3 steps):

1. For rows of 2: 2·6=12, so there are 6 rows and remainder 0.
2. For rows of 3: 3·4=12, so there are 4 rows and remainder 0.
3. Both arrangements are possible.

## Result

**Answer.** 6 rows of 2; 4 rows of 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
