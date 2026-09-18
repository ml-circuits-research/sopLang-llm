# Explanation 8.2.6 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=170, B=110, C=110, D=100) = 100 documents/hour.
2. Stage D grows by 25%, from 100 to 125 documents/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 110 documents/hour, attained by B and C, so those stages are the final bottlenecks.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(170, 110, 110, 100) = 100 documents/hour.
2. Stage D increases from 100 to 125 documents/hour.
3. The new capacities are 170, 110, 110, 125. Their minimum is 110, so the bottleneck is B, C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 100 documents/hour. After the improvement: 110 documents/hour. Final bottleneck stage(s): B, C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
