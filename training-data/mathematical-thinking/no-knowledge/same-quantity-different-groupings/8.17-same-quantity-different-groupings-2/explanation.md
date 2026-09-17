# Explanation 8.17 — Same Quantity, Different Groupings 2

## Explanation

1. The same 30 pieces are regrouped without loss, so each grouping divides 30 exactly.
2. Groups of 5 give 30 ÷ 5 = 6 groups, and groups of 6 give 30 ÷ 6 = 5 groups.
3. Both counts satisfy 5×6 = 6×5 = 30, so nothing remains in either case.
4. The smaller grouping size produces more groups, so groups of 5 yield the larger number of groups.

Reference solution as printed in the source (chapter 8, 3 steps):

1. With 5 in each group: 5×6=30, so 6 groups.
2. With 6 in each group: 6×5=30, so 5 groups.
3. Compare 6 and 5: the grouping with fewer objects in each group produces more groups.

## Result

**Answer.** 6 groups of 5; 5 groups of 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
