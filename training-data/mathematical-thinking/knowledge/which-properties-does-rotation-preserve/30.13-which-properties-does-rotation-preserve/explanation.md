# Explanation 30.13 — Which properties does rotation preserve?

## Explanation

1. The rectangle is 2×5 and is rotated by 90°, one quarter-turn.
2. A rotation preserves the side lengths but turns the figure, so the horizontal and vertical roles of the two sides swap, the property the circuit reads from its fact wire.
3. Written as horizontal × vertical the dimensions become 5×2.

Reference solution as printed in the source (chapter 30, 4 steps):

1. Rotation does not change side lengths.
2. The side that was vertical becomes horizontal.
3. The side that was horizontal becomes vertical.
4. Written in that order, the dimensions become 5×2.

## Result

**Answer.** 5×2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
