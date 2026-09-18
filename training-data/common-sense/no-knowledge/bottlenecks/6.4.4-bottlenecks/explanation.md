# Explanation 6.4.4 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=180, B=90, C=120, D=140) = 90 residents/hour.
2. Stage B grows by 20%, from 90 to 108 residents/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 108 residents/hour, attained by B, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(180, 90, 120, 140) = 90 residents/hour.
2. Stage B increases from 90 to 108 residents/hour.
3. The new capacities are 180, 108, 120, 140. Their minimum is 108, so the bottleneck is B. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 90 residents/hour. After the improvement: 108 residents/hour. Final bottleneck stage(s): B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
