# Explanation 118 — Choosing a public budget package: case 3

## Explanation

1. The budget is 14 units and no project is mandatory.
2. A plan is feasible only when the costs of its projects sum to at most 14, and among the feasible plans the greatest benefit wins; the best benefit turns out to be 21.
3. Among the plans reaching 21, the cheapest one is bridge repair, library books, drainage with cost 14, so no higher-benefit feasible package exists.

Reference solution as printed in the source (family C6, 4 steps):

1. Budget limit is 14.
2. Evaluate feasible combinations (and keep the mandatory project if any).
3. The best feasible combination has cost 14 and benefit 21: ['bridge repair', 'library books', 'drainage'].
4. No higher-benefit feasible combination exists under the stated costs.

## Result

**Answer.** Choose bridge repair, library books, drainage; cost 14, benefit 21.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
