# Explanation 22.20 — A closed path

## Explanation

1. A path returns to its start when every east move is cancelled by a west move and every north move by a south move, so both displacements must be zero.
2. Here the north and south moves cancel and the east and west moves cancel, so the robot is back at its starting square.

Reference solution as printed in the source (chapter 22, 4 steps):

1. N moves the robot one square north.
2. S later cancels that vertical displacement.
3. E and W cancel the horizontal displacement.
4. Both coordinate changes are zero at the end.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
