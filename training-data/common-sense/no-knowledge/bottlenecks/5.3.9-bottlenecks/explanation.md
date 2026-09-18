# Explanation 5.3.9 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=130, B=120, C=110, D=150) = 110 operations/hour.
2. Stage C grows by 15%, from 110 to 126.5 operations/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 120 operations/hour, attained by B, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(130, 120, 110, 150) = 110 operations/hour.
2. Stage C increases from 110 to 126.5 operations/hour.
3. The new capacities are 130, 120, 126.5, 150. Their minimum is 120, so the bottleneck is B. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 110 operations/hour. After the improvement: 120 operations/hour. Final bottleneck stage(s): B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
