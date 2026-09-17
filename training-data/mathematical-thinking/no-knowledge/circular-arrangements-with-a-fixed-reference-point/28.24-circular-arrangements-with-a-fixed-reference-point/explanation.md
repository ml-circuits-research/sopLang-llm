# Explanation 28.24 — Circular arrangements with a fixed reference point

## Explanation

1. Fixing A at the top removes the rotations from the count, so each circled arrangement is counted once.
2. That leaves the other 2 flags to be placed in the remaining positions.
3. They can be ordered in 2 ways.

Reference solution as printed in the source (chapter 28, 4 steps):

1. A is no longer a choice: it is fixed at the top.
2. Two positions and two flags remain.
3. B can take the first position and C the second, or vice versa.
4. Under the stated convention, there are 2 distinct arrangements.

## Result

**Answer.** 2 ways.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
