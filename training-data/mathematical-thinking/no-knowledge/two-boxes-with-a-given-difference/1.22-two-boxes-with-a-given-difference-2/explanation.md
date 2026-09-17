# Explanation 1.22 — Two Boxes with a Given Difference 2

## Explanation

1. The two boxes together hold 12, and the first box holds 4 more than the second.
2. Removing the extra 4 from the total leaves two equal shares of 4.
3. Returning the extra to the first box gives 8 in Box A and 4 in Box B, and the two numbers add up to 12 again as a check.

Reference solution as printed in the source (chapter 1, 4 steps):

1. List pairs with sum 12: for example 0+12, 1+11, 2+10, and continue.
2. Look for the pair in which the first number is 4 greater than the second.
3. The correct pair is 8+4=12, and 8-4=4.
4. Both conditions are satisfied, so the solution is unique in the nonnegative integers.

## Result

**Answer.** Box A: 8; Box B: 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
