# Explanation 33.13 — If/else branch

## Explanation

1. The branch is selected by the parity of x: an even x uses the first formula and an odd x uses the second.
2. For x=7 the value is odd, so the second formula applies.
3. Applying it gives y=8.

Reference solution as printed in the source (chapter 33, 4 steps):

1. 7 cannot be divided into pairs with no remainder.
2. The condition “even” is false.
3. Execute only the “otherwise” branch.
4. y=7+1=8.

## Result

**Answer.** 8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
