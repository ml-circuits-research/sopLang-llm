# Explanation 7.4.2 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=110, B=100, C=90, D=160) = 90 service units/hour.
2. Stage C grows by 25%, from 90 to 112.5 service units/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 100 service units/hour, attained by B, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(110, 100, 90, 160) = 90 service units/hour.
2. Stage C increases from 90 to 112.5 service units/hour.
3. The new capacities are 110, 100, 112.5, 160. Their minimum is 100, so the bottleneck is B. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 90 service units/hour. After the improvement: 100 service units/hour. Final bottleneck stage(s): B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
