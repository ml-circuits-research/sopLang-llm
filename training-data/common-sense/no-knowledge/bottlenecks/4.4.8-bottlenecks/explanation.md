# Explanation 4.4.8 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=110, B=160, C=90, D=80) = 80 measurements/hour.
2. Stage D grows by 25%, from 80 to 100 measurements/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 90 measurements/hour, attained by C, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(110, 160, 90, 80) = 80 measurements/hour.
2. Stage D increases from 80 to 100 measurements/hour.
3. The new capacities are 110, 160, 90, 100. Their minimum is 90, so the bottleneck is C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 80 measurements/hour. After the improvement: 90 measurements/hour. Final bottleneck stage(s): C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
