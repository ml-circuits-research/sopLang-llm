# Explanation 25.6 — A missing piece in a mosaic

## Explanation

1. The rectangle holds 3 rows of 4 unit squares, so its capacity is 12 squares.
2. Nine squares are already in place, so the unfilled part is the capacity minus the placed squares.
3. That leaves 3 missing squares.

Reference solution as printed in the source (chapter 25, 4 steps):

1. The rectangle has 3×4=12 cells.
2. Each cell receives exactly one unit square.
3. Nine cells are occupied.
4. 12−9=3 cells remain empty.

## Result

**Answer.** 3 squares.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
