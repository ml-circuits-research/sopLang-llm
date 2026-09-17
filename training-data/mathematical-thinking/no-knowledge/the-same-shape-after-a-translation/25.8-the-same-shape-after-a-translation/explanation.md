# Explanation 25.8 — The same shape after a translation

## Explanation

1. A translation moves every point of the piece by the same 3-square displacement to the right.
2. Because the displacement is identical for all points, all distances and angles between points stay the same, and no turning or flipping is involved.
3. So the shape is unchanged and only the position differs.

Reference solution as printed in the source (chapter 25, 4 steps):

1. Every point of the piece moves by the same displacement.
2. Distances and relative orientation between points do not change.
3. Therefore the shape and orientation remain the same.
4. Only the location of the piece changes.

## Result

**Answer.** The shape does not change; only the position changes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
