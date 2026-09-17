# Explanation 25.12 — A half-turn rotation

## Explanation

1. A half-turn sends every point to the point diametrically opposite the center, so each end of the rectangle swaps with the other end.
2. The 1×2 rectangle is unchanged by that swap, and because the piece has no markings nothing distinguishes its two orientations.
3. The rotated piece therefore occupies the same shape relative to the center.

Reference solution as printed in the source (chapter 25, 4 steps):

1. The shape has two ends symmetric about the center.
2. After a half-turn, the ends exchange places.
3. Because there are no markings that distinguish the ends, the outline coincides.
4. The shape is invariant under this rotation.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
