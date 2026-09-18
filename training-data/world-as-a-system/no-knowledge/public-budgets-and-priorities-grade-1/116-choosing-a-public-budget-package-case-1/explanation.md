# Explanation 116 — Choosing a public budget package: case 1

## Explanation

1. The budget is 12 units and no project is mandatory.
2. A plan is feasible only when the costs of its projects sum to at most 12, and among the feasible plans the greatest benefit wins; the best benefit turns out to be 17.
3. Among the plans reaching 17, the cheapest one is bridge repair, drainage with cost 11, so no higher-benefit feasible package exists.

Reference solution as printed in the source (family C6, 4 steps):

1. Budget limit is 12.
2. Evaluate feasible combinations (and keep the mandatory project if any).
3. The best feasible combination has cost 11 and benefit 17: ['bridge repair', 'drainage'].
4. No higher-benefit feasible combination exists under the stated costs.

## Result

**Answer.** Choose bridge repair, drainage; cost 11, benefit 17.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
