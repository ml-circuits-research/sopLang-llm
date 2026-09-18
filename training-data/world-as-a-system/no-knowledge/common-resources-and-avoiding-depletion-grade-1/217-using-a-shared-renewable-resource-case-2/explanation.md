# Explanation 217 — Using a shared renewable resource: case 2

## Explanation

1. The total harvest is 4 users × 4 each = 16.
2. The stock equation gives 70 + 11 − 16 = 65 at the end of the period.
3. Because the end stock is below the starting level of 70, the planned use is depleting.
4. Matching regeneration exactly means sharing 11 fish among 4 users, so each may take 11 ÷ 4 = 2.75.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=4×4=16.
2. End stock=70+11−16=65.
3. To match regeneration exactly, equal harvest per user would be 11÷4=2.75.

## Result

**Answer.** End stock 65; depleting. Equal regeneration-matching share: 2.75 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
