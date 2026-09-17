# Explanation 34.16 — Minimize cost for a minimum quantity

## Explanation

1. Every purchase is a count of packages A and B, and only purchases reaching 8 units qualify.
2. Comparing the qualifying combinations by cost leaves 2 packages A and 0 packages B at 8 units for 10.
3. The alternatives like 1 A and 1 B or 2 B cost more, so 2 packages A is the minimum-cost choice.

Reference solution as printed in the source (chapter 34, 4 steps):

1. 2A covers exactly 8 and costs 10.
2. A+B covers 11 and costs 13.
3. 2B covers 14 and costs 16.
4. All satisfy the minimum, but 10 is the lowest cost.

## Result

**Answer.** 2 packages A, cost 10.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
