# Explanation 39.11 — Proof using a lower bound

## Explanation

1. Multiplying the least number of tickets by the least price gives a lower bound on the total cost.
2. That lower bound is already above the available money, so no purchase can meet the requirements.

Reference solution as printed in the source (chapter 39, 4 steps):

1. Even choosing the cheapest possible tickets, each costs 3.
2. Four cost at least 12.
3. The budget is 10.
4. If even the minimum possible cost exceeds the budget, no choice can work.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
