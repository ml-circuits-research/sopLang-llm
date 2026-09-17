# Explanation 8.16 — Same Quantity, Different Groupings 1

## Explanation

1. The same 24 pieces are regrouped without loss, so each grouping divides 24 exactly.
2. Groups of 4 give 24 ÷ 4 = 6 groups, and groups of 6 give 24 ÷ 6 = 4 groups.
3. Both counts satisfy 4×6 = 6×4 = 24, so nothing remains in either case.
4. The smaller grouping size produces more groups, so groups of 4 yield the larger number of groups.

Reference solution as printed in the source (chapter 8, 3 steps):

1. With 4 in each group: 4×6=24, so 6 groups.
2. With 6 in each group: 6×4=24, so 4 groups.
3. Compare 6 and 4: the grouping with fewer objects in each group produces more groups.

## Result

**Answer.** 6 groups of 4; 4 groups of 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
