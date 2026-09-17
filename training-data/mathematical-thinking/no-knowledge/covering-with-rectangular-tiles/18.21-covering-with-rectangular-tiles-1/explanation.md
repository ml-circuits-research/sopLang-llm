# Explanation 18.21 — Covering with Rectangular Tiles 1

## Explanation

1. All tiles have the same orientation, so the tiling is a regular grid of 3×2 tiles.
2. Along the length, 12 ÷ 3 = 4 tiles fit; along the width, 8 ÷ 2 = 4 tiles fit.
3. The number of tiles is the product of the two counts, 4 × 4 = 16, and exact division means no tile is cut.

Reference solution as printed in the source (chapter 18, 3 steps):

1. Along the length: 12÷3=4 tiles.
2. Along the width: 8÷2=4 tiles.
3. Form a grid of 4×4: 16 tiles in total.

## Result

**Answer.** 16

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
