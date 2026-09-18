# Explanation 6.3.7 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=180, B=140, C=90, D=170) = 90 residents/hour.
2. Stage C grows by 20%, from 90 to 108 residents/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 108 residents/hour, attained by C, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(180, 140, 90, 170) = 90 residents/hour.
2. Stage C increases from 90 to 108 residents/hour.
3. The new capacities are 180, 140, 108, 170. Their minimum is 108, so the bottleneck is C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 90 residents/hour. After the improvement: 108 residents/hour. Final bottleneck stage(s): C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
