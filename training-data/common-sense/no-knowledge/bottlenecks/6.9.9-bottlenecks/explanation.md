# Explanation 6.9.9 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=110, B=130, C=170, D=150) = 110 residents/hour.
2. Stage A grows by 15%, from 110 to 126.5 residents/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 126.5 residents/hour, attained by A, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(110, 130, 170, 150) = 110 residents/hour.
2. Stage A increases from 110 to 126.5 residents/hour.
3. The new capacities are 126.5, 130, 170, 150. Their minimum is 126.5, so the bottleneck is A. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 110 residents/hour. After the improvement: 126.5 residents/hour. Final bottleneck stage(s): A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
