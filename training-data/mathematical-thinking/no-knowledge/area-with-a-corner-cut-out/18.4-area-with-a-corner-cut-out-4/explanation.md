# Explanation 18.4 — Area with a Corner Cut Out 4

## Explanation

1. The board is a rectangle 16 by 12, so its area is 16×12 = 192.
2. The piece cut from the corner is a 4 by 4 rectangle with area 4×4 = 16.
3. Because the two regions do not overlap, the remaining area is the board area minus the cut-out area, 192 − 16 = 176.

Reference solution as printed in the source (chapter 18, 3 steps):

1. Area of the entire board: 16×12=192.
2. Area of the cutout: 4×4=16.
3. Remaining area: 192-16=176.

## Result

**Answer.** 176

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
