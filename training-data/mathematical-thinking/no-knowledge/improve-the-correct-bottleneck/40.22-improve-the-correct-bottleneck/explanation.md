# Explanation 40.22 — Improve the correct bottleneck

## Explanation

1. The current throughput is the smallest capacity, 6 objects/hour, because that stage is the bottleneck.
2. Upgrading a stage that is not the bottleneck leaves the smallest capacity unchanged, while upgrading B raises it to 8.
3. Only the upgrade of B increases the system throughput, so the answer is to increase B.

Reference solution as printed in the source (chapter 40, 4 steps):

1. If you increase A, B remains the bottleneck at 6.
2. If you increase B from 6 to 8, the capacities become 10, 8, 8.
3. The minimum becomes 8.
4. Only the investment in B increases throughput.

## Result

**Answer.** Increase the capacity of B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
