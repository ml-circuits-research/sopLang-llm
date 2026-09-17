# Explanation 30.3 — Two translations compose

## Explanation

1. Two moves in the same direction compose into a single move, so the displacements 2 and 5 are added.
2. Their total is 7, so the total effect is 7 units to the right.

Reference solution as printed in the source (chapter 30, 4 steps):

1. The first move changes the position by +2.
2. The second adds another +5.
3. Displacements in the same direction add.
4. The total effect is +7 to the right.

## Result

**Answer.** 7 units to the right.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
