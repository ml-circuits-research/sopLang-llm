# Explanation 22.9 — Minimum detour around a blockage

## Explanation

1. The direct route of 4 steps passes through the blocked square, so it cannot be used.
2. Leaving the row before the blockage and returning to it after costs two extra steps, giving a minimum of 6 steps.

Reference solution as printed in the source (chapter 22, 4 steps):

1. The direct route E,E,E,E would enter the blocked square on the second step.
2. The robot can first move one square north or south to a neighboring row.
3. It then moves east far enough to pass the blocked column.
4. Returning to the target row costs one additional opposite vertical step, so the shortest route has 4+2=6 steps.

## Result

**Answer.** 6 steps.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
