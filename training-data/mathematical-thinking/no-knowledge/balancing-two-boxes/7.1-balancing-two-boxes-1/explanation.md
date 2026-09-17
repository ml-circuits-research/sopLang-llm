# Explanation 7.1 — Balancing Two Boxes 1

## Explanation

1. Box A starts 8 cubes ahead of Box B, and moving one cube takes 1 away from A while giving 1 to B.
2. Each move therefore closes the gap by 2, so the gap of 8 shrinks by 2 per move.
3. Dividing the gap in half gives 8 ÷ 2 = 4 moves, after which both boxes hold 14 cubes.
4. The equality check 18 - 4 = 10 + 4 confirms the answer.

Reference solution as printed in the source (chapter 7, 4 steps):

1. The initial difference is 18-10=8.
2. One move reduces the difference by 2: A loses 1 and B gains 1.
3. To reduce the difference from 8 to 0, 4 moves are needed.
4. Check: 18-4=14 and 10+4=14.

## Result

**Answer.** 4 cubes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
