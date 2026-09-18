# Explanation 966 — Using a shared renewable resource: case 1

## Explanation

1. The total harvest is 7 users × 3 each = 21.
2. The stock equation gives 100 + 10 − 21 = 89 at the end of the period.
3. Because the end stock is below the starting level of 100, the planned use is depleting.
4. Matching regeneration exactly means sharing 10 fish among 7 users, so each may take 10 ÷ 7 = 1.43.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=7×3=21.
2. End stock=100+10−21=89.
3. To match regeneration exactly, equal harvest per user would be 10÷7=1.43.

## Result

**Answer.** End stock 89; depleting. Equal regeneration-matching share: 1.43 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
