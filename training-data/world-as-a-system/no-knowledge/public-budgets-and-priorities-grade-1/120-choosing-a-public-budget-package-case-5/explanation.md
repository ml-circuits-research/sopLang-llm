# Explanation 120 — Choosing a public budget package: case 5

## Explanation

1. The budget is 16 units and no project is mandatory.
2. A plan is feasible only when the costs of its projects sum to at most 16, and among the feasible plans the greatest benefit wins; the best benefit turns out to be 22.
3. Among the plans reaching 22, the cheapest one is park, bridge repair, drainage with cost 15, so no higher-benefit feasible package exists.

Reference solution as printed in the source (family C6, 4 steps):

1. Budget limit is 16.
2. Evaluate feasible combinations (and keep the mandatory project if any).
3. The best feasible combination has cost 15 and benefit 22: ['park', 'bridge repair', 'drainage'].
4. No higher-benefit feasible combination exists under the stated costs.

## Result

**Answer.** Choose park, bridge repair, drainage; cost 15, benefit 22.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
