# Explanation 16.22 — Largest Allowed Numerical Code 2

## Explanation

1. Each digit must be used exactly once, so the candidates are the permutations of the printed digits, and the code must also stay strictly between the two bounds.
2. Enumerating the permutations of [2, 4, 6, 8] and discarding those outside (4000, 7000) leaves a set of legal codes.
3. Among the legal codes the largest one is read off by taking the largest possible leading digit first and then the remaining digits in decreasing order, which yields 6842.

Reference solution as printed in the source (chapter 16, 4 steps):

1. To make the number as large as possible, first choose the largest possible thousands digit without exceeding the limit 7000.
2. Then, in order, choose the largest remaining digits for hundreds, tens, and ones, while checking the interval.
3. The largest valid candidate is 6842.
4. Check: it uses every digit exactly once and 4000<6842<7000.

## Result

**Answer.** 6842

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
