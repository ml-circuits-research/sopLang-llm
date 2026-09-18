# Explanation 717 — Using a shared renewable resource: case 2

## Explanation

1. The total harvest is 6 users × 4 each = 24.
2. The stock equation gives 90 + 11 − 24 = 77 at the end of the period.
3. Because the end stock is below the starting level of 90, the planned use is depleting.
4. Matching regeneration exactly means sharing 11 fish among 6 users, so each may take 11 ÷ 6 = 1.83.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=6×4=24.
2. End stock=90+11−24=77.
3. To match regeneration exactly, equal harvest per user would be 11÷6=1.83.

## Result

**Answer.** End stock 77; depleting. Equal regeneration-matching share: 1.83 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
