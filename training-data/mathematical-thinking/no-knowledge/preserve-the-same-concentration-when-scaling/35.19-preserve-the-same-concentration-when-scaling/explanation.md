# Explanation 35.19 — Preserve the same concentration when scaling

## Explanation

1. The original recipe uses 2 parts syrup and 8 parts water, a total of 10 parts.
2. Scaling multiplies both amounts by 2, giving 4 parts syrup and 16 parts water.
3. The total also grows by the same factor, so 4/20 reduces to the same fraction 1/5: the concentration is preserved.

Reference solution as printed in the source (chapter 35, 4 steps):

1. Double both quantities: 2→4 and 8→16.
2. The total becomes 20.
3. The syrup fraction is 4/20=1/5.
4. The ratio remains the same because both components were scaled equally.

## Result

**Answer.** 4 parts syrup, 16 parts water; the fraction remains 1/5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
