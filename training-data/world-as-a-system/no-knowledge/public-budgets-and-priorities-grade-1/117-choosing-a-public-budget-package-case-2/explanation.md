# Explanation 117 — Choosing a public budget package: case 2

## Explanation

1. The budget is 13 units and no project is mandatory.
2. A plan is feasible only when the costs of its projects sum to at most 13, and among the feasible plans the greatest benefit wins; the best benefit turns out to be 19.
3. Among the plans reaching 19, the cheapest one is tree planting, library books, drainage with cost 13, so no higher-benefit feasible package exists.

Reference solution as printed in the source (family C6, 4 steps):

1. Budget limit is 13.
2. Evaluate feasible combinations (and keep the mandatory project if any).
3. The best feasible combination has cost 13 and benefit 19: ['tree planting', 'library books', 'drainage'].
4. No higher-benefit feasible combination exists under the stated costs.

## Result

**Answer.** Choose tree planting, library books, drainage; cost 13, benefit 19.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
