# Explanation 30.25 — Transforming a shape and the path of a point

## Explanation

1. The triangle with 3 vertices is translated 2 units to the right.
2. A translation moves every point of a figure by the same displacement, the property the circuit reads from its fact wire, so the figure keeps its shape instead of stretching.
3. All three vertices must move by that displacement; moving only one would tear the figure apart.

Reference solution as printed in the source (chapter 30, 4 steps):

1. The figure consists of all its points, not just one vertex.
2. The definition of translation requires the same displacement for every point.
3. Moving only one vertex would change lengths and shape.
4. All vertices and all points of the figure must move.

## Result

**Answer.** All points must move by the same displacement.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
