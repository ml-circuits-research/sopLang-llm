# Explanation 22.17 — A required intermediate landmark

## Explanation

1. With only horizontal and vertical steps, the shortest path between two cells is the sum of the row gap and the column gap.
2. Going start→library costs 3 steps and library→target costs 2 steps, for a total of 5.

Reference solution as printed in the source (chapter 22, 4 steps):

1. From (1,1) to (1,4) requires 3 horizontal steps.
2. From (1,4) to (3,4) requires 2 vertical steps.
3. Because the library is required, the two distances must both be paid.
4. The minimum total is 3+2=5.

## Result

**Answer.** 5 steps.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
