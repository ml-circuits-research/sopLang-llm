# Explanation 6.10.6 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=140, B=140, C=150, D=160) = 140 residents/hour.
2. Stage A grows by 20%, from 140 to 168 residents/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 140 residents/hour, attained by B, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(140, 140, 150, 160) = 140 residents/hour.
2. Stage A increases from 140 to 168 residents/hour.
3. The new capacities are 168, 140, 150, 160. Their minimum is 140, so the bottleneck is B. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 140 residents/hour. After the improvement: 140 residents/hour. Final bottleneck stage(s): B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
