# Explanation 39.23 — Checking a conditional statement on a finite domain

## Explanation

1. A conditional statement is only at risk when its hypothesis is satisfied, so the values that are multiples of the divisor are the ones to check.
2. Filtering the domain by that condition leaves only the values that could possibly falsify the statement.

Reference solution as printed in the source (chapter 39, 4 steps):

1. List the multiples of 4 in the domain.
2. 4=4×1 and 8=4×2.
3. 12 would be next, but it lies outside the domain.
4. Verify that 4 and 8 are even; the statement holds on the given domain.

## Result

**Answer.** 4 and 8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
