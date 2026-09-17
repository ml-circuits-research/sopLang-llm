# Explanation 13.3 — Two Numbers: Sum and Difference 3

## Explanation

1. The two numbers add up to 44, and the first is 8 larger than the second.
2. Removing the difference 8 from the sum leaves two equal quantities: 44 − 8 = 36.
3. Half of that is the second number, 18, and adding the difference back gives the first, 26.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Mentally remove the difference 8 from the total: 44-8=36.
2. The remainder represents two equal quantities, so each is 18.
3. The smaller number is 18; the larger number is 18+8=26.
4. Check: 18+26=44, and 26-18=8.

## Result

**Answer.** 26 and 18.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
