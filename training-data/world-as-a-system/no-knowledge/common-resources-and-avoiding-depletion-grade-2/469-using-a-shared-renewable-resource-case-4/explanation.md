# Explanation 469 — Using a shared renewable resource: case 4

## Explanation

1. The total harvest is 5 users × 6 each = 30.
2. The stock equation gives 80 + 13 − 30 = 63 at the end of the period.
3. Because the end stock is below the starting level of 80, the planned use is depleting.
4. Matching regeneration exactly means sharing 13 fish among 5 users, so each may take 13 ÷ 5 = 2.60.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=5×6=30.
2. End stock=80+13−30=63.
3. To match regeneration exactly, equal harvest per user would be 13÷5=2.60.

## Result

**Answer.** End stock 63; depleting. Equal regeneration-matching share: 2.60 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
