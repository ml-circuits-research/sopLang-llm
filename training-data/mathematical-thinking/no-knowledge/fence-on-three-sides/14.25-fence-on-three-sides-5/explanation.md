# Explanation 14.25 — Fence on Three Sides 5

## Explanation

1. The fence goes around the garden, but one full side is already a wall, so only three of the four sides need fencing.
2. The wall replaces one of the 18 m sides, which leaves the opposite 18 m side plus both 8 m sides.
3. Adding those three sides gives 18+8+8 = 34 m, half of the perimeter plus the one remaining long side.

Reference solution as printed in the source (chapter 14, 3 steps):

1. Do not count the side covered by the wall.
2. The other long side remains: 18 m, plus two sides of 8 m.
3. Total: 18+8+8=34 m.

## Result

**Answer.** 34 m

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
