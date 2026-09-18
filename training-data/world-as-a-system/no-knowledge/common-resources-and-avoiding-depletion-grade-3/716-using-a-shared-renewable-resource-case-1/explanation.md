# Explanation 716 — Using a shared renewable resource: case 1

## Explanation

1. The total harvest is 6 users × 3 each = 18.
2. The stock equation gives 90 + 10 − 18 = 82 at the end of the period.
3. Because the end stock is below the starting level of 90, the planned use is depleting.
4. Matching regeneration exactly means sharing 10 fish among 6 users, so each may take 10 ÷ 6 = 1.67.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=6×3=18.
2. End stock=90+10−18=82.
3. To match regeneration exactly, equal harvest per user would be 10÷6=1.67.

## Result

**Answer.** End stock 82; depleting. Equal regeneration-matching share: 1.67 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
