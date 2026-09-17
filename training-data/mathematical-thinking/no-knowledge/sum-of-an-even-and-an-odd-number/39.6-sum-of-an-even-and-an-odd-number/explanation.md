# Explanation 39.6 — Sum of an even and an odd number

## Explanation

1. Writing the even number as 2m and the odd number as 2n+1 and adding them gives 2(m+n)+1.
2. The sum is therefore of the odd form 2k+1, so its parity is odd.

Reference solution as printed in the source (chapter 39, 4 steps):

1. Add the expressions.
2. We obtain 2m+2n+1.
3. Group as 2(m+n)+1.
4. This has the form of an odd number.

## Result

**Answer.** Odd.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
