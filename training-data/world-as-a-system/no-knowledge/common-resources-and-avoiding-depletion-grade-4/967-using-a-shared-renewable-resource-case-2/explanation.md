# Explanation 967 — Using a shared renewable resource: case 2

## Explanation

1. The total harvest is 7 users × 4 each = 28.
2. The stock equation gives 100 + 11 − 28 = 83 at the end of the period.
3. Because the end stock is below the starting level of 100, the planned use is depleting.
4. Matching regeneration exactly means sharing 11 fish among 7 users, so each may take 11 ÷ 7 = 1.57.

Reference solution as printed in the source (family N19, 3 steps):

1. Total harvest=7×4=28.
2. End stock=100+11−28=83.
3. To match regeneration exactly, equal harvest per user would be 11÷7=1.57.

## Result

**Answer.** End stock 83; depleting. Equal regeneration-matching share: 1.57 each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
