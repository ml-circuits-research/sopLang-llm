# Explanation 3.13 — Two Ways to Arrange the Pieces 3

## Explanation

1. An arrangement is possible exactly when repeatedly taking groups of the required size leaves no piece over, which is the same as the remainder being zero.
2. For rows of 4, 20 splits into 5 rows because 5 × 4 = 20.
3. For rows of 5, 20 splits into 4 rows because 4 × 5 = 20.
4. Both remainders are zero, so the claim is confirmed and the numbers of rows differ because the row sizes differ.

Reference solution as printed in the source (chapter 3, 3 steps):

1. For rows of 4: 4·5=20, so there are 5 rows and remainder 0.
2. For rows of 5: 5·4=20, so there are 4 rows and remainder 0.
3. Both arrangements are possible.

## Result

**Answer.** 5 rows of 4; 4 rows of 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
