# Explanation 13.2 — Two Numbers: Sum and Difference 2

## Explanation

1. The two numbers add up to 36, and the first is 6 larger than the second.
2. Removing the difference 6 from the sum leaves two equal quantities: 36 − 6 = 30.
3. Half of that is the second number, 15, and adding the difference back gives the first, 21.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Mentally remove the difference 6 from the total: 36-6=30.
2. The remainder represents two equal quantities, so each is 15.
3. The smaller number is 15; the larger number is 15+6=21.
4. Check: 15+21=36, and 21-15=6.

## Result

**Answer.** 21 and 15.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
