# Explanation 18.2 — Area with a Corner Cut Out 2

## Explanation

1. The board is a rectangle 12 by 9, so its area is 12×9 = 108.
2. The piece cut from the corner is a 4 by 3 rectangle with area 4×3 = 12.
3. Because the two regions do not overlap, the remaining area is the board area minus the cut-out area, 108 − 12 = 96.

Reference solution as printed in the source (chapter 18, 3 steps):

1. Area of the entire board: 12×9=108.
2. Area of the cutout: 4×3=12.
3. Remaining area: 108-12=96.

## Result

**Answer.** 96

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
