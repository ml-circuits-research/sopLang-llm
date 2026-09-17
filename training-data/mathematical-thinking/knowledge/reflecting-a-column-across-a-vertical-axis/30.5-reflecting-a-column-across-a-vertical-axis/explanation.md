# Explanation 30.5 — Reflecting a column across a vertical axis

## Explanation

1. The point is 3 columns from the axis at column 5.
2. A reflection keeps the distance to the axis and puts the image on the other side, the property the circuit reads from its fact wire.
3. The image therefore lies at column 8.

Reference solution as printed in the source (chapter 30, 4 steps):

1. P is at distance 5−2=3 from the axis.
2. Reflection preserves this distance on the opposite side.
3. Move 3 columns right from 5.
4. 5+3=8.

## Result

**Answer.** Column 8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
