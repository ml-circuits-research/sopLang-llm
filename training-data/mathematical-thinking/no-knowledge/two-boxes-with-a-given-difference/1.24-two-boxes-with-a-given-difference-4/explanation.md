# Explanation 1.24 — Two Boxes with a Given Difference 4

## Explanation

1. The two boxes together hold 16, and the first box holds 6 more than the second.
2. Removing the extra 6 from the total leaves two equal shares of 5.
3. Returning the extra to the first box gives 11 in Box A and 5 in Box B, and the two numbers add up to 16 again as a check.

Reference solution as printed in the source (chapter 1, 4 steps):

1. List pairs with sum 16: for example 0+16, 1+15, 2+14, and continue.
2. Look for the pair in which the first number is 6 greater than the second.
3. The correct pair is 11+5=16, and 11-5=6.
4. Both conditions are satisfied, so the solution is unique in the nonnegative integers.

## Result

**Answer.** Box A: 11; Box B: 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
