# Explanation 16.23 — Largest Allowed Numerical Code 3

## Explanation

1. Each digit must be used exactly once, so the candidates are the permutations of the printed digits, and the code must also stay strictly between the two bounds.
2. Enumerating the permutations of [1, 4, 7, 9] and discarding those outside (5000, 9000) leaves a set of legal codes.
3. Among the legal codes the largest one is read off by taking the largest possible leading digit first and then the remaining digits in decreasing order, which yields 7941.

Reference solution as printed in the source (chapter 16, 4 steps):

1. To make the number as large as possible, first choose the largest possible thousands digit without exceeding the limit 9000.
2. Then, in order, choose the largest remaining digits for hundreds, tens, and ones, while checking the interval.
3. The largest valid candidate is 7941.
4. Check: it uses every digit exactly once and 5000<7941<9000.

## Result

**Answer.** 7941

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
