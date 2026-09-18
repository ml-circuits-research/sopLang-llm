# Explanation 10.6.10 — Bottlenecks

## Explanation

1. Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(A=110, B=90, C=120, D=80) = 80 beneficiaries/hour.
2. Stage D grows by 30%, from 80 to 104 beneficiaries/hour; the other stages keep their capacities.
3. The smallest capacity after the improvement is 90 beneficiaries/hour, attained by B, so that stage is the final bottleneck.
4. Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.

Reference solution as printed in the source (template 3, 3 steps):

1. Because every unit must pass through every serial stage, initial throughput is min(110, 90, 120, 80) = 80 beneficiaries/hour.
2. Stage D increases from 80 to 104 beneficiaries/hour.
3. The new capacities are 110, 90, 120, 104. Their minimum is 90, so the bottleneck is B. Adding capacities would incorrectly treat required serial stages as if they were parallel sources.

## Result

**Answer.** Initial capacity: 80 beneficiaries/hour. After the improvement: 90 beneficiaries/hour. Final bottleneck stage(s): B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
