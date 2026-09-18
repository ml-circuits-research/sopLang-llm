# Explanation 9.2.4 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=180, B=80, C=80, D=130) = 80 uses/hour.
2. Stage B grows by 30%, from 80 to 104 uses/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 80 uses/hour, attained by C, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(180, 80, 80, 130) = 80 uses/hour.
2. Stage B increases from 80 to 104 uses/hour.
3. The new capacities are 180, 104, 80, 130. Their minimum is 80, so the bottleneck is C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 80 uses/hour. After the improvement: 80 uses/hour. Final bottleneck stage(s): C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
