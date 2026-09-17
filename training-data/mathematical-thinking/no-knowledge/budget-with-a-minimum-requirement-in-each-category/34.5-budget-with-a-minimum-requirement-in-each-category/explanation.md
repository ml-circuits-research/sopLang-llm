# Explanation 34.5 — Budget with a minimum requirement in each category

## Explanation

1. The requirement forces the smallest allowed purchase: 2 objects A and 3 objects B.
2. Its cost is 2×7 + 3×4 = 26 lei, and buying more would only cost more.
3. Subtracting that from the 30 lei budget leaves 4 lei untouched.

Reference solution as printed in the source (chapter 34, 4 steps):

1. The minimum cost for A is 14.
2. The minimum cost for B is 12.
3. Together, 26.
4. From 30, 4 remain.

## Result

**Answer.** 26 lei; 4 lei remain.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
