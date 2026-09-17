# Explanation 25.10 — An axis of symmetry by matching halves

## Explanation

1. A line is an axis of symmetry when folding the figure along it makes the two halves coincide exactly.
2. In a rectangle that is not a square the two halves on either side of the vertical center line are mirror images of one another.
3. For every point on one half there is a matching point at the same distance on the other half, so the fold overlaps exactly: the answer is Yes.

Reference solution as printed in the source (chapter 25, 4 steps):

1. The line passes through the middle of the rectangle.
2. The left and right halves have equal width and height.
3. When folded, corresponding edges coincide.
4. Therefore the vertical center line is an axis of symmetry.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
