# Explanation 4.5.5 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=170, B=150, C=100, D=100) = 100 measurements/hour.
2. Stage C grows by 15%, from 100 to 115 measurements/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 100 measurements/hour, attained by D, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(170, 150, 100, 100) = 100 measurements/hour.
2. Stage C increases from 100 to 115 measurements/hour.
3. The new capacities are 170, 150, 115, 100. Their minimum is 100, so the bottleneck is D. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 100 measurements/hour. After the improvement: 100 measurements/hour. Final bottleneck stage(s): D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
