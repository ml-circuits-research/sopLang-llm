# Explanation 295 — Bottlenecks in the Yarrow–Linden exchange network

## Explanation

1. Each branch is a chain of edges, so it can only carry the smallest edge capacity along it.
2. Branch 1 is limited by its narrowest edge, so it carries 4 units.
3. Branch 2 is limited by its narrowest edge, so it carries 6 units.
4. The independent branch capacities add to 10 units on their way to Linden.
5. No shared destination cap is stated, so the branches carry the full sum.

Reference solution as printed in the source (family G9, 4 steps):

1. Branch 1 is limited by min(9,4)=4.
2. Branch 2 is limited by min(6,6)=6.
3. Together the branches could carry 10 units.
4. No extra shared cap is given, so the maximum is 10.

## Result

**Answer.** 10 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
