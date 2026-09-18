# Explanation 219 — Using a shared renewable resource: case 4

## Explanation

1. The total harvest is 4 users × 6 each = 24.
2. The stock equation gives 70 + 13 − 24 = 59 at the end of the period.
3. Because the end stock is below the starting level of 70, the planned use is depleting.
4. Matching regeneration exactly means sharing 13 fish among 4 users, so each may take 13 ÷ 4 = 3.25.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=4×6=24.
2. End stock=70+13−24=59.
3. To match regeneration exactly, equal harvest per user would be 13÷4=3.25.

## Result

**Answer.** End stock 59; depleting. Equal regeneration-matching share: 3.25 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
