# Explanation 25.18 — Completing an alternating construction

## Explanation

1. The row repeats a cycle of 2 shapes, so the shape at a position depends only on the remainder of the position when divided by 2.
2. Position 11 is 5 whole cycles plus 0 further steps.
3. The remainder 0 points to the start of the cycle, so the shape is triangle.

Reference solution as printed in the source (chapter 25, 4 steps):

1. Position 1 is a triangle.
2. The pattern repeats every two positions.
3. Positions 1,3,5,7,9,11 are odd.
4. All odd positions contain a triangle.

## Result

**Answer.** Triangle.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
