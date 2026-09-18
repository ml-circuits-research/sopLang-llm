# Explanation 795 — Bottlenecks in the Willow–Cedar exchange network

## Explanation

1. Each branch is a chain of edges, so it can only carry the smallest edge capacity along it.
2. Branch 1 is limited by its narrowest edge, so it carries 6 units.
3. Branch 2 is limited by its narrowest edge, so it carries 6 units.
4. The independent branch capacities add to 12 units on their way to Cedar.
5. The destination accepts at most 10 units, so the sum is capped at min(12, 10)=10.

Reference solution as printed in the source (family G9, 4 steps):

1. Branch 1 is limited by min(11,6)=6.
2. Branch 2 is limited by min(6,8)=6.
3. Together the branches could carry 12 units.
4. The destination accepts at most 10, so the final maximum is min(12,10)=10.

## Result

**Answer.** 10 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
