# Explanation 2.1.1 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=170, B=140, C=100, D=130) = 100 units/hour.
2. Stage C grows by 30%, from 100 to 130 units/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 130 units/hour, attained by C and D, so those stages are the final bottlenecks.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(170, 140, 100, 130) = 100 units/hour.
2. Stage C increases from 100 to 130 units/hour.
3. The new capacities are 170, 140, 130, 130. Their minimum is 130, so the bottleneck is C, D. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 100 units/hour. After the improvement: 130 units/hour. Final bottleneck stage(s): C, D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
