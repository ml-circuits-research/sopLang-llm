# Explanation 9.1.7 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=100, B=180, C=160, D=150) = 100 uses/hour.
2. Stage A grows by 30%, from 100 to 130 uses/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 130 uses/hour, attained by A, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(100, 180, 160, 150) = 100 uses/hour.
2. Stage A increases from 100 to 130 uses/hour.
3. The new capacities are 130, 180, 160, 150. Their minimum is 130, so the bottleneck is A. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 100 uses/hour. After the improvement: 130 uses/hour. Final bottleneck stage(s): A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
