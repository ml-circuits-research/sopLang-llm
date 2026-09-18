# Explanation 719 — Using a shared renewable resource: case 4

## Explanation

1. The total harvest is 6 users × 6 each = 36.
2. The stock equation gives 90 + 13 − 36 = 67 at the end of the period.
3. Because the end stock is below the starting level of 90, the planned use is depleting.
4. Matching regeneration exactly means sharing 13 fish among 6 users, so each may take 13 ÷ 6 = 2.17.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=6×6=36.
2. End stock=90+13−36=67.
3. To match regeneration exactly, equal harvest per user would be 13÷6=2.17.

## Result

**Answer.** End stock 67; depleting. Equal regeneration-matching share: 2.17 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
