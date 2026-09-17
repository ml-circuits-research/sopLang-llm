# Explanation 13.4 — Two Numbers: Sum and Difference 4

## Explanation

1. The two numbers add up to 50, and the first is 10 larger than the second.
2. Removing the difference 10 from the sum leaves two equal quantities: 50 − 10 = 40.
3. Half of that is the second number, 20, and adding the difference back gives the first, 30.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Mentally remove the difference 10 from the total: 50-10=40.
2. The remainder represents two equal quantities, so each is 20.
3. The smaller number is 20; the larger number is 20+10=30.
4. Check: 20+30=50, and 30-20=10.

## Result

**Answer.** 30 and 20.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
