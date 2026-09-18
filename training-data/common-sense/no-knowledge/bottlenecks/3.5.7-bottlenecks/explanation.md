# Explanation 3.5.7 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=80, B=160, C=110, D=150) = 80 participants/hour.
2. Stage A grows by 30%, from 80 to 104 participants/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 104 participants/hour, attained by A, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(80, 160, 110, 150) = 80 participants/hour.
2. Stage A increases from 80 to 104 participants/hour.
3. The new capacities are 104, 160, 110, 150. Their minimum is 104, so the bottleneck is A. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 80 participants/hour. After the improvement: 104 participants/hour. Final bottleneck stage(s): A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
