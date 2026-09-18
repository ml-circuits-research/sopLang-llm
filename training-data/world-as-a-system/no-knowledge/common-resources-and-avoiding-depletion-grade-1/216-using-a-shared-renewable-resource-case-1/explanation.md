# Explanation 216 — Using a shared renewable resource: case 1

## Explanation

1. The total harvest is 4 users × 3 each = 12.
2. The stock equation gives 70 + 10 − 12 = 68 at the end of the period.
3. Because the end stock is below the starting level of 70, the planned use is depleting.
4. Matching regeneration exactly means sharing 10 fish among 4 users, so each may take 10 ÷ 4 = 2.50.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=4×3=12.
2. End stock=70+10−12=68.
3. To match regeneration exactly, equal harvest per user would be 10÷4=2.50.

## Result

**Answer.** End stock 68; depleting. Equal regeneration-matching share: 2.50 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
