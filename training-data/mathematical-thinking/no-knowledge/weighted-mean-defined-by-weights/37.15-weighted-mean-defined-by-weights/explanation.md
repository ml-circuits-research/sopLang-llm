# Explanation 37.15 — Weighted mean defined by weights

## Explanation

1. The statement defines the weighted mean as the sum of value×weight divided by the sum of the weights.
2. The weighted numerator is 8×1 + 10×2 = 28, and the weights add to 3.
3. The mean is 28/3, printed as 9⅓.

Reference solution as printed in the source (chapter 37, 4 steps):

1. A contributes 8.
2. B contributes 20.
3. Weighted sum 28, total weight 3.
4. The mean is 28/3=9⅓.

## Result

**Answer.** 9⅓.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
