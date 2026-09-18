# Explanation 8.1.9 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=160, B=120, C=110, D=160) = 110 documents/hour.
2. Stage C grows by 30%, from 110 to 143 documents/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 120 documents/hour, attained by B, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(160, 120, 110, 160) = 110 documents/hour.
2. Stage C increases from 110 to 143 documents/hour.
3. The new capacities are 160, 120, 143, 160. Their minimum is 120, so the bottleneck is B. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 110 documents/hour. After the improvement: 120 documents/hour. Final bottleneck stage(s): B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
