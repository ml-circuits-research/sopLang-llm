# Explanation 7.10.4 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=130, B=80, C=130, D=130) = 80 service units/hour.
2. Stage B grows by 15%, from 80 to 92 service units/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 92 service units/hour, attained by B, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(130, 80, 130, 130) = 80 service units/hour.
2. Stage B increases from 80 to 92 service units/hour.
3. The new capacities are 130, 92, 130, 130. Their minimum is 92, so the bottleneck is B. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 80 service units/hour. After the improvement: 92 service units/hour. Final bottleneck stage(s): B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
