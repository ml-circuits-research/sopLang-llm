# Explanation 7.2.8 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=160, B=130, C=180, D=140) = 130 service units/hour.
2. Stage B grows by 25%, from 130 to 162.5 service units/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 140 service units/hour, attained by D, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(160, 130, 180, 140) = 130 service units/hour.
2. Stage B increases from 130 to 162.5 service units/hour.
3. The new capacities are 160, 162.5, 180, 140. Their minimum is 140, so the bottleneck is D. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 130 service units/hour. After the improvement: 140 service units/hour. Final bottleneck stage(s): D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
