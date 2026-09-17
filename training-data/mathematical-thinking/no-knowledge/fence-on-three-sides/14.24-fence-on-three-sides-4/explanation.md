# Explanation 14.24 — Fence on Three Sides 4

## Explanation

1. The fence goes around the garden, but one full side is already a wall, so only three of the four sides need fencing.
2. The wall replaces one of the 16 m sides, which leaves the opposite 16 m side plus both 7 m sides.
3. Adding those three sides gives 16+7+7 = 30 m, half of the perimeter plus the one remaining long side.

Reference solution as printed in the source (chapter 14, 3 steps):

1. Do not count the side covered by the wall.
2. The other long side remains: 16 m, plus two sides of 7 m.
3. Total: 16+7+7=30 m.

## Result

**Answer.** 30 m

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
