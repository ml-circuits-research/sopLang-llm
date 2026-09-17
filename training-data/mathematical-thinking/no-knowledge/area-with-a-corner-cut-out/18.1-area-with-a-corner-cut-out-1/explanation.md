# Explanation 18.1 — Area with a Corner Cut Out 1

## Explanation

1. The board is a rectangle 10 by 8, so its area is 10×8 = 80.
2. The piece cut from the corner is a 3 by 2 rectangle with area 3×2 = 6.
3. Because the two regions do not overlap, the remaining area is the board area minus the cut-out area, 80 − 6 = 74.

Reference solution as printed in the source (chapter 18, 3 steps):

1. Area of the entire board: 10×8=80.
2. Area of the cutout: 3×2=6.
3. Remaining area: 80-6=74.

## Result

**Answer.** 74

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
