# Explanation 25.5 — Pieces that form a rectangle

## Explanation

1. A rectangle filled without gaps needs a whole number of rows and columns whose product is the 6 available unit squares.
2. So every whole-number divisor of 6 gives one dimension, and the matching dimension is 6 divided by it.
3. Listing the divisor pairs up to symmetry gives 1×6 or 2×3.

Reference solution as printed in the source (chapter 25, 4 steps):

1. The number of cells in the rectangle is rows×columns.
2. We seek products equal to 6.
3. 6=1×6 and 6=2×3.
4. Rotating a rectangle does not create a new unordered dimension type, so the types are 1×6 and 2×3.

## Result

**Answer.** 1×6 or 2×3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
