# Explanation 31.18 — Comparing chances without decimals

## Explanation

1. The two chances are the fractions 2/3 and 3/5, and comparing fractions without decimals uses cross-multiplication.
2. Multiplying each numerator by the other denominator gives 10 and 9.
3. The larger product belongs to game A, which therefore has the greater chance.

Reference solution as printed in the source (chapter 31, 4 steps):

1. Compute 2×5=10.
2. Compute 3×3=9.
3. Since 10>9, 2/3>3/5.
4. Game A has the greater chance.

## Result

**Answer.** Game A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
