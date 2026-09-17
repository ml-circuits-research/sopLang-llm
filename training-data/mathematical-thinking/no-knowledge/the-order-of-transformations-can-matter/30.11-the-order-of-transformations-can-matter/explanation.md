# Explanation 30.11 — The order of transformations can matter

## Explanation

1. Operation T adds 1 to the column and operation S replaces the column c by −c.
2. T then S gives −(2 + 1) = -3, while S then T gives −2 + 1 = -1.
3. The two compositions differ, so the order of the transformations matters.

Reference solution as printed in the source (chapter 30, 4 steps):

1. T then S: column 2 becomes 3, then −3.
2. S then T: 2 becomes −2, then −1.
3. The results −3 and −1 differ.
4. Therefore the order of these transformations cannot be swapped freely.

## Result

**Answer.** No; the results differ.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
