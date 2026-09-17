# Explanation 35.2 — Decrease below zero on a defined scale

## Explanation

1. The reading starts at 2°C and falls by 5°C, so the change is subtracted from the position.
2. Because the fall is larger than 2, the position passes 0 and continues with the negative readings -1, -2, -3, as the statement defines.
3. Counting 5 steps down from 2 lands on -3°C.

Reference solution as printed in the source (chapter 35, 4 steps):

1. From 2, subtract 2 to reach 0.
2. We still need to subtract 3.
3. Move down to -1,-2,-3.
4. The result is -3°C.

## Result

**Answer.** -3°C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
