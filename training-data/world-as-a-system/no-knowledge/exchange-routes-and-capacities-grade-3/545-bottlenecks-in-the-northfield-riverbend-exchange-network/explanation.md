# Explanation 545 — Bottlenecks in the Northfield–Riverbend exchange network

## Explanation

1. Each branch is a chain of edges, so it can only carry the smallest edge capacity along it.
2. Branch 1 is limited by its narrowest edge, so it carries 5 units.
3. Branch 2 is limited by its narrowest edge, so it carries 6 units.
4. The independent branch capacities add to 11 units on their way to Riverbend.
5. The destination accepts at most 9 units, so the sum is capped at min(11, 9)=9.

Reference solution as printed in the source (family G9, 4 steps):

1. Branch 1 is limited by min(10,5)=5.
2. Branch 2 is limited by min(6,7)=6.
3. Together the branches could carry 11 units.
4. The destination accepts at most 9, so the final maximum is min(11,9)=9.

## Result

**Answer.** 9 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
