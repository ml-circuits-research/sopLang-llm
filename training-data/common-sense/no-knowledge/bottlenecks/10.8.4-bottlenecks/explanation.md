# Explanation 10.8.4 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=140, B=140, C=110, D=170) = 110 beneficiaries/hour.
2. Stage C grows by 15%, from 110 to 126.5 beneficiaries/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 126.5 beneficiaries/hour, attained by C, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(140, 140, 110, 170) = 110 beneficiaries/hour.
2. Stage C increases from 110 to 126.5 beneficiaries/hour.
3. The new capacities are 140, 140, 126.5, 170. Their minimum is 126.5, so the bottleneck is C. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 110 beneficiaries/hour. After the improvement: 126.5 beneficiaries/hour. Final bottleneck stage(s): C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
