# Explanation 18.5 — Area with a Corner Cut Out 5

## Explanation

1. The board is a rectangle 18 by 11, so its area is 18×11 = 198.
2. The piece cut from the corner is a 6 by 3 rectangle with area 6×3 = 18.
3. Because the two regions do not overlap, the remaining area is the board area minus the cut-out area, 198 − 18 = 180.

Reference solution as printed in the source (chapter 18, 3 steps):

1. Area of the entire board: 18×11=198.
2. Area of the cutout: 6×3=18.
3. Remaining area: 198-18=180.

## Result

**Answer.** 180

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
