# Explanation 8.20 — Same Quantity, Different Groupings 5

## Explanation

1. The same 42 pieces are regrouped without loss, so each grouping divides 42 exactly.
2. Groups of 6 give 42 ÷ 6 = 7 groups, and groups of 7 give 42 ÷ 7 = 6 groups.
3. Both counts satisfy 6×7 = 7×6 = 42, so nothing remains in either case.
4. The smaller grouping size produces more groups, so groups of 6 yield the larger number of groups.

Reference solution as printed in the source (chapter 8, 3 steps):

1. With 6 in each group: 6×7=42, so 7 groups.
2. With 7 in each group: 7×6=42, so 6 groups.
3. Compare 7 and 6: the grouping with fewer objects in each group produces more groups.

## Result

**Answer.** 7 groups of 6; 6 groups of 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
