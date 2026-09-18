# Explanation 7.8.10 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=110, B=170, C=90, D=110) = 90 service units/hour.
2. Stage C grows by 20%, from 90 to 108 service units/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 108 service units/hour, attained by C, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(110, 170, 90, 110) = 90 service units/hour.
2. Stage C increases from 90 to 108 service units/hour.
3. The new capacities are 110, 170, 108, 110. Their minimum is 108, so the bottleneck is C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 90 service units/hour. After the improvement: 108 service units/hour. Final bottleneck stage(s): C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
