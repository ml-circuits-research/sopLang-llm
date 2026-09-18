# Explanation 720 — Using a shared renewable resource: case 5

## Explanation

1. The total harvest is 6 users × 7 each = 42.
2. The stock equation gives 90 + 14 − 42 = 62 at the end of the period.
3. Because the end stock is below the starting level of 90, the planned use is depleting.
4. Matching regeneration exactly means sharing 14 fish among 6 users, so each may take 14 ÷ 6 = 2.33.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=6×7=42.
2. End stock=90+14−42=62.
3. To match regeneration exactly, equal harvest per user would be 14÷6=2.33.

## Result

**Answer.** End stock 62; depleting. Equal regeneration-matching share: 2.33 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
