# Explanation 40.10 — Inventory with a reorder threshold

## Explanation

1. The policy places an order when the inventory falls below 5 units.
2. After 3 units are sold the inventory is 7 - 3 = 4.
3. Because 4 is below 5, an order should be placed.

Reference solution as printed in the source (chapter 40, 4 steps):

1. After the sale, 7-3=4 remain.
2. The rule activates strictly below 5.
3. 4 is below 5.
4. The order is placed.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
