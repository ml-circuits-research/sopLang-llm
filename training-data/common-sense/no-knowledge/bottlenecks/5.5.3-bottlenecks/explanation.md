# Explanation 5.5.3 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=160, B=180, C=170, D=180) = 160 operations/hour.
2. Stage A grows by 15%, from 160 to 184 operations/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 170 operations/hour, attained by C, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(160, 180, 170, 180) = 160 operations/hour.
2. Stage A increases from 160 to 184 operations/hour.
3. The new capacities are 184, 180, 170, 180. Their minimum is 170, so the bottleneck is C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 160 operations/hour. After the improvement: 170 operations/hour. Final bottleneck stage(s): C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
