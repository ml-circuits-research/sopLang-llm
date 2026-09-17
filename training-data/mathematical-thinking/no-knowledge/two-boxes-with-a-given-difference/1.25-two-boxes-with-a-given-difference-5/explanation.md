# Explanation 1.25 — Two Boxes with a Given Difference 5

## Explanation

1. The two boxes together hold 18, and the first box holds 4 more than the second.
2. Removing the extra 4 from the total leaves two equal shares of 7.
3. Returning the extra to the first box gives 11 in Box A and 7 in Box B, and the two numbers add up to 18 again as a check.

Reference solution as printed in the source (chapter 1, 4 steps):

1. List pairs with sum 18: for example 0+18, 1+17, 2+16, and continue.
2. Look for the pair in which the first number is 4 greater than the second.
3. The correct pair is 11+7=18, and 11-7=4.
4. Both conditions are satisfied, so the solution is unique in the nonnegative integers.

## Result

**Answer.** Box A: 11; Box B: 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
