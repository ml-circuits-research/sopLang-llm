# Explanation 37.3 — Missing value from a mean

## Explanation

1. The statement gives the mean but not its definition, so the solution uses the rule that the mean of 3 numbers is their sum divided by 3.
2. The full sum is therefore 3 × 7 = 21, and the two known values add to 13.
3. The missing number is 21 − 13 = 8.

Reference solution as printed in the source (chapter 37, 4 steps):

1. If the mean is 7 for 3 numbers, the sum must be 21.
2. The known values sum to 13.
3. The missing value is 21-13=8.
4. Check: (5+8+8)/3=7.

## Result

**Answer.** 8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
