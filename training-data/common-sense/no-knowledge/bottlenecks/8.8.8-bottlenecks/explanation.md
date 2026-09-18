# Explanation 8.8.8 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=160, B=180, C=150, D=140) = 140 documents/hour.
2. Stage D grows by 25%, from 140 to 175 documents/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 150 documents/hour, attained by C, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(160, 180, 150, 140) = 140 documents/hour.
2. Stage D increases from 140 to 175 documents/hour.
3. The new capacities are 160, 180, 150, 175. Their minimum is 150, so the bottleneck is C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 140 documents/hour. After the improvement: 150 documents/hour. Final bottleneck stage(s): C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
