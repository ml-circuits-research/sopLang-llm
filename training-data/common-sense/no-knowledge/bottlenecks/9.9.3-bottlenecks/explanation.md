# Explanation 9.9.3 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=170, B=160, C=160, D=180) = 160 uses/hour.
2. Stage B grows by 30%, from 160 to 208 uses/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 160 uses/hour, attained by C, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(170, 160, 160, 180) = 160 uses/hour.
2. Stage B increases from 160 to 208 uses/hour.
3. The new capacities are 170, 208, 160, 180. Their minimum is 160, so the bottleneck is C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 160 uses/hour. After the improvement: 160 uses/hour. Final bottleneck stage(s): C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
