# Explanation 25.15 — Cutting a rectangle into two pieces

## Explanation

1. Cutting with no loss keeps the total area, so the two pieces together still contain 12 unit squares.
2. One piece accounts for 5 of them, so the other accounts for the difference.
3. The second piece has 7 unit squares.

Reference solution as printed in the source (chapter 25, 4 steps):

1. Cutting adds or removes no material.
2. The total area of the two pieces remains 12.
3. If one has 5, the other has 12−5=7.
4. Check: 5+7=12.

## Result

**Answer.** 7 unit squares.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
