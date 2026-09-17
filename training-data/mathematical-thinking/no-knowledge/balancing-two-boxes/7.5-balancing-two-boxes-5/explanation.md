# Explanation 7.5 — Balancing Two Boxes 5

## Explanation

1. Box A starts 12 cubes ahead of Box B, and moving one cube takes 1 away from A while giving 1 to B.
2. Each move therefore closes the gap by 2, so the gap of 12 shrinks by 2 per move.
3. Dividing the gap in half gives 12 ÷ 2 = 6 moves, after which both boxes hold 28 cubes.
4. The equality check 34 - 6 = 22 + 6 confirms the answer.

Reference solution as printed in the source (chapter 7, 4 steps):

1. The initial difference is 34-22=12.
2. One move reduces the difference by 2: A loses 1 and B gains 1.
3. To reduce the difference from 12 to 0, 6 moves are needed.
4. Check: 34-6=28 and 22+6=28.

## Result

**Answer.** 6 cubes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
