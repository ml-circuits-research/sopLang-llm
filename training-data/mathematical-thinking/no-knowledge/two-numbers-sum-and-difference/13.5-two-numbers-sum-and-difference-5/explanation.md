# Explanation 13.5 — Two Numbers: Sum and Difference 5

## Explanation

1. The two numbers add up to 60, and the first is 12 larger than the second.
2. Removing the difference 12 from the sum leaves two equal quantities: 60 − 12 = 48.
3. Half of that is the second number, 24, and adding the difference back gives the first, 36.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Mentally remove the difference 12 from the total: 60-12=48.
2. The remainder represents two equal quantities, so each is 24.
3. The smaller number is 24; the larger number is 24+12=36.
4. Check: 24+36=60, and 36-24=12.

## Result

**Answer.** 36 and 24.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
