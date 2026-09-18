# Explanation 970 — Using a shared renewable resource: case 5

## Explanation

1. The total harvest is 7 users × 7 each = 49.
2. The stock equation gives 100 + 14 − 49 = 65 at the end of the period.
3. Because the end stock is below the starting level of 100, the planned use is depleting.
4. Matching regeneration exactly means sharing 14 fish among 7 users, so each may take 14 ÷ 7 = 2.00.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=7×7=49.
2. End stock=100+14−49=65.
3. To match regeneration exactly, equal harvest per user would be 14÷7=2.00.

## Result

**Answer.** End stock 65; depleting. Equal regeneration-matching share: 2.00 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
