# Explanation 3.12 — Two Ways to Arrange the Pieces 2

## Explanation

1. An arrangement is possible exactly when repeatedly taking groups of the required size leaves no piece over, which is the same as the remainder being zero.
2. For rows of 2, 18 splits into 9 rows because 9 × 2 = 18.
3. For rows of 3, 18 splits into 6 rows because 6 × 3 = 18.
4. Both remainders are zero, so the claim is confirmed and the numbers of rows differ because the row sizes differ.

Reference solution as printed in the source (chapter 3, 3 steps):

1. For rows of 2: 2·9=18, so there are 9 rows and remainder 0.
2. For rows of 3: 3·6=18, so there are 6 rows and remainder 0.
3. Both arrangements are possible.

## Result

**Answer.** 9 rows of 2; 6 rows of 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
