# Explanation 466 — Using a shared renewable resource: case 1

## Explanation

1. The total harvest is 5 users × 3 each = 15.
2. The stock equation gives 80 + 10 − 15 = 75 at the end of the period.
3. Because the end stock is below the starting level of 80, the planned use is depleting.
4. Matching regeneration exactly means sharing 10 fish among 5 users, so each may take 10 ÷ 5 = 2.00.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=5×3=15.
2. End stock=80+10−15=75.
3. To match regeneration exactly, equal harvest per user would be 10÷5=2.00.

## Result

**Answer.** End stock 75; depleting. Equal regeneration-matching share: 2.00 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
