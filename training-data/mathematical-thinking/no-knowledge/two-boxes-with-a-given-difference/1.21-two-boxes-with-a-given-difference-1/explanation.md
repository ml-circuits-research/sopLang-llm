# Explanation 1.21 — Two Boxes with a Given Difference 1

## Explanation

1. The two boxes together hold 10, and the first box holds 2 more than the second.
2. Removing the extra 2 from the total leaves two equal shares of 4.
3. Returning the extra to the first box gives 6 in Box A and 4 in Box B, and the two numbers add up to 10 again as a check.

Reference solution as printed in the source (chapter 1, 4 steps):

1. List pairs with sum 10: for example 0+10, 1+9, 2+8, and continue.
2. Look for the pair in which the first number is 2 greater than the second.
3. The correct pair is 6+4=10, and 6-4=2.
4. Both conditions are satisfied, so the solution is unique in the nonnegative integers.

## Result

**Answer.** Box A: 6; Box B: 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
