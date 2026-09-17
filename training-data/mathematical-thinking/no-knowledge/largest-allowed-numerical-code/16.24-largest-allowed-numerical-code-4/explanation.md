# Explanation 16.24 — Largest Allowed Numerical Code 4

## Explanation

1. Each digit must be used exactly once, so the candidates are the permutations of the printed digits, and the code must also stay strictly between the two bounds.
2. Enumerating the permutations of [2, 3, 8, 9] and discarding those outside (2000, 5000) leaves a set of legal codes.
3. Among the legal codes the largest one is read off by taking the largest possible leading digit first and then the remaining digits in decreasing order, which yields 3982.

Reference solution as printed in the source (chapter 16, 4 steps):

1. To make the number as large as possible, first choose the largest possible thousands digit without exceeding the limit 5000.
2. Then, in order, choose the largest remaining digits for hundreds, tens, and ones, while checking the interval.
3. The largest valid candidate is 3982.
4. Check: it uses every digit exactly once and 2000<3982<5000.

## Result

**Answer.** 3982

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
