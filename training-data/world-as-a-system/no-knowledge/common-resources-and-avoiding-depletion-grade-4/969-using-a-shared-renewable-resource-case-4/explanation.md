# Explanation 969 — Using a shared renewable resource: case 4

## Explanation

1. The total harvest is 7 users × 6 each = 42.
2. The stock equation gives 100 + 13 − 42 = 71 at the end of the period.
3. Because the end stock is below the starting level of 100, the planned use is depleting.
4. Matching regeneration exactly means sharing 13 fish among 7 users, so each may take 13 ÷ 7 = 1.86.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=7×6=42.
2. End stock=100+13−42=71.
3. To match regeneration exactly, equal harvest per user would be 13÷7=1.86.

## Result

**Answer.** End stock 71; depleting. Equal regeneration-matching share: 1.86 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
