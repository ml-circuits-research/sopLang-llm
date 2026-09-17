# Explanation 14.22 — Fence on Three Sides 2

## Explanation

1. The fence goes around the garden, but one full side is already a wall, so only three of the four sides need fencing.
2. The wall replaces one of the 12 m sides, which leaves the opposite 12 m side plus both 5 m sides.
3. Adding those three sides gives 12+5+5 = 22 m, half of the perimeter plus the one remaining long side.

Reference solution as printed in the source (chapter 14, 3 steps):

1. Do not count the side covered by the wall.
2. The other long side remains: 12 m, plus two sides of 5 m.
3. Total: 12+5+5=22 m.

## Result

**Answer.** 22 m

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
