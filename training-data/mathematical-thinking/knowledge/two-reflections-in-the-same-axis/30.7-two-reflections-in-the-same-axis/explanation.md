# Explanation 30.7 — Two reflections in the same axis

## Explanation

1. The point is reflected 2 times in the same axis, so the operation is applied twice.
2. Each reflection swaps the two sides while keeping the distance to the axis, so the second application undoes the first, a fact the circuit reads from its fact wire.
3. After an even number of reflections the point is back at its initial position.

Reference solution as printed in the source (chapter 30, 4 steps):

1. The first reflection moves the point to the same distance on the opposite side.
2. The second starts there and switches sides again.
3. Distance from the axis remains the same.
4. The result coincides with the initial position.

## Result

**Answer.** It returns to the initial point.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
