# Explanation 10.9.1 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=100, B=130, C=150, D=150) = 100 beneficiaries/hour.
2. Stage A grows by 25%, from 100 to 125 beneficiaries/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 125 beneficiaries/hour, attained by A, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(100, 130, 150, 150) = 100 beneficiaries/hour.
2. Stage A increases from 100 to 125 beneficiaries/hour.
3. The new capacities are 125, 130, 150, 150. Their minimum is 125, so the bottleneck is A. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 100 beneficiaries/hour. After the improvement: 125 beneficiaries/hour. Final bottleneck stage(s): A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
