# Explanation 34.8 — Minimum cuts for equal pieces

## Explanation

1. One cut turns a single rod into two pieces, and the problem states that each further cut adds exactly one piece.
2. After k cuts the rod has 1 + k pieces, so reaching 5 pieces means 1 + k = 5.
3. Solving that gives 4 cuts, and no arrangement without stacking can do it faster.

Reference solution as printed in the source (chapter 34, 4 steps):

1. At the beginning there is one piece.
2. Each cut adds one piece.
3. To reach 5, we must add 4.
4. Therefore 4 cuts are needed.

## Result

**Answer.** 4 cuts.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
