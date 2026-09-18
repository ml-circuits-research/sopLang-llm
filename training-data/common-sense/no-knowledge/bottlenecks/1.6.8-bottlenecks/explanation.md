# Explanation 1.6.8 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=130, B=120, C=130, D=160) = 120 cases/hour.
2. Stage B grows by 30%, from 120 to 156 cases/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 130 cases/hour, attained by A and C, so those stages are the final bottlenecks.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(130, 120, 130, 160) = 120 cases/hour.
2. Stage B increases from 120 to 156 cases/hour.
3. The new capacities are 130, 156, 130, 160. Their minimum is 130, so the bottleneck is A, C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 120 cases/hour. After the improvement: 130 cases/hour. Final bottleneck stage(s): A, C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
