# Explanation 9.3.1 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=120, B=140, C=100, D=80) = 80 uses/hour.
2. Stage D grows by 20%, from 80 to 96 uses/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 96 uses/hour, attained by D, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(120, 140, 100, 80) = 80 uses/hour.
2. Stage D increases from 80 to 96 uses/hour.
3. The new capacities are 120, 140, 100, 96. Their minimum is 96, so the bottleneck is D. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 80 uses/hour. After the improvement: 96 uses/hour. Final bottleneck stage(s): D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
