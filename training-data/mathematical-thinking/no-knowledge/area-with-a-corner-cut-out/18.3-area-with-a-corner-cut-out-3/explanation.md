# Explanation 18.3 — Area with a Corner Cut Out 3

## Explanation

1. The board is a rectangle 14 by 10, so its area is 14×10 = 140.
2. The piece cut from the corner is a 5 by 2 rectangle with area 5×2 = 10.
3. Because the two regions do not overlap, the remaining area is the board area minus the cut-out area, 140 − 10 = 130.

Reference solution as printed in the source (chapter 18, 3 steps):

1. Area of the entire board: 14×10=140.
2. Area of the cutout: 5×2=10.
3. Remaining area: 140-10=130.

## Result

**Answer.** 130

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
