# Explanation 468 — Using a shared renewable resource: case 3

## Explanation

1. The total harvest is 5 users × 5 each = 25.
2. The stock equation gives 80 + 12 − 25 = 67 at the end of the period.
3. Because the end stock is below the starting level of 80, the planned use is depleting.
4. Matching regeneration exactly means sharing 12 fish among 5 users, so each may take 12 ÷ 5 = 2.40.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=5×5=25.
2. End stock=80+12−25=67.
3. To match regeneration exactly, equal harvest per user would be 12÷5=2.40.

## Result

**Answer.** End stock 67; depleting. Equal regeneration-matching share: 2.40 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
