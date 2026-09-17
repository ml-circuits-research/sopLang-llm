# Explanation 30.9 — Four 90° rotations

## Explanation

1. The shape is rotated 4 times by 90°, so the total rotation is 360°.
2. A full turn is 360°, the convention the circuit reads from its fact wire, and 360° is exactly a whole number of full turns.
3. After a whole number of complete turns the shape has the same orientation as at the start.

Reference solution as printed in the source (chapter 30, 4 steps):

1. Each rotation advances one quarter-turn.
2. Four quarters make one full turn.
3. A full turn returns every direction to its original orientation.
4. The position may remain centered, and the orientation is the same.

## Result

**Answer.** The same orientation as at the start.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
