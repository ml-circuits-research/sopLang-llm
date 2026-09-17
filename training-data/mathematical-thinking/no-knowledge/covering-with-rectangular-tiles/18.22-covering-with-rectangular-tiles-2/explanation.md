# Explanation 18.22 — Covering with Rectangular Tiles 2

## Explanation

1. All tiles have the same orientation, so the tiling is a regular grid of 5×2 tiles.
2. Along the length, 15 ÷ 5 = 3 tiles fit; along the width, 10 ÷ 2 = 5 tiles fit.
3. The number of tiles is the product of the two counts, 3 × 5 = 15, and exact division means no tile is cut.

Reference solution as printed in the source (chapter 18, 3 steps):

1. Along the length: 15÷5=3 tiles.
2. Along the width: 10÷2=5 tiles.
3. Form a grid of 3×5: 15 tiles in total.

## Result

**Answer.** 15

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
