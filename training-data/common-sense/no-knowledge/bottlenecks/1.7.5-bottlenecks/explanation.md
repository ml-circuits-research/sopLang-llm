# Explanation 1.7.5 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=160, B=180, C=90, D=150) = 90 cases/hour.
2. Stage C grows by 30%, from 90 to 117 cases/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 117 cases/hour, attained by C, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(160, 180, 90, 150) = 90 cases/hour.
2. Stage C increases from 90 to 117 cases/hour.
3. The new capacities are 160, 180, 117, 150. Their minimum is 117, so the bottleneck is C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 90 cases/hour. After the improvement: 117 cases/hour. Final bottleneck stage(s): C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
