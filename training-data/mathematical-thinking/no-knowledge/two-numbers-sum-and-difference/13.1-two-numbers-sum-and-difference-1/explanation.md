# Explanation 13.1 — Two Numbers: Sum and Difference 1

## Explanation

1. The two numbers add up to 28, and the first is 4 larger than the second.
2. Removing the difference 4 from the sum leaves two equal quantities: 28 − 4 = 24.
3. Half of that is the second number, 12, and adding the difference back gives the first, 16.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Mentally remove the difference 4 from the total: 28-4=24.
2. The remainder represents two equal quantities, so each is 12.
3. The smaller number is 12; the larger number is 12+4=16.
4. Check: 12+16=28, and 16-12=4.

## Result

**Answer.** 16 and 12.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
