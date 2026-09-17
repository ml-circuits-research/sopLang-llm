# Explanation 22.25 — The shortest instruction sequence

## Explanation

1. Without diagonal moves, every step changes exactly one coordinate by one, so reaching a target needs at least as many steps as the total east and north displacement.
2. The target needs 2 east steps and 1 north steps, a minimum of 3, which is more than 2.

Reference solution as printed in the source (chapter 22, 4 steps):

1. The target requires two separate eastward coordinate changes.
2. It also requires one northward coordinate change.
3. With only cardinal moves, one step changes only one coordinate by one unit.
4. Therefore at least 3 steps are required; both proposed routes are shortest.

## Result

**Answer.** No; the minimum is 3 steps.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
