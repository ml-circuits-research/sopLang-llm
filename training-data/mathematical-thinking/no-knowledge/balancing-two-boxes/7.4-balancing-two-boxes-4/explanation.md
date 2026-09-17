# Explanation 7.4 — Balancing Two Boxes 4

## Explanation

1. Box A starts 10 cubes ahead of Box B, and moving one cube takes 1 away from A while giving 1 to B.
2. Each move therefore closes the gap by 2, so the gap of 10 shrinks by 2 per move.
3. Dividing the gap in half gives 10 ÷ 2 = 5 moves, after which both boxes hold 25 cubes.
4. The equality check 30 - 5 = 20 + 5 confirms the answer.

Reference solution as printed in the source (chapter 7, 4 steps):

1. The initial difference is 30-20=10.
2. One move reduces the difference by 2: A loses 1 and B gains 1.
3. To reduce the difference from 10 to 0, 5 moves are needed.
4. Check: 30-5=25 and 20+5=25.

## Result

**Answer.** 5 cubes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
