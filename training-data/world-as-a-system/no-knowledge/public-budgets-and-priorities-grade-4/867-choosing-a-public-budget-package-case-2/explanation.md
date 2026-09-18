# Explanation 867 — Choosing a public budget package: case 2

## Explanation

1. The budget is 19 units and no project is mandatory.
2. A plan is feasible only when the costs of its projects sum to at most 19, and among the feasible plans the greatest benefit wins; the best benefit turns out to be 28.
3. Among the plans reaching 28, the cheapest one is tree planting, bridge repair, library books, drainage with cost 19, so no higher-benefit feasible package exists.

Reference solution as printed in the source (family C6, 4 steps):

1. Budget limit is 19.
2. Evaluate feasible combinations (and keep the mandatory project if any).
3. The best feasible combination has cost 19 and benefit 28: ['tree planting', 'bridge repair', 'library books', 'drainage'].
4. No higher-benefit feasible combination exists under the stated costs. Cross-domain check: 13−4=9 independent reports remain.

## Result

**Answer.** Choose tree planting, bridge repair, library books, drainage; cost 19, benefit 28. Cross-domain answer: 9 independent reports.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
