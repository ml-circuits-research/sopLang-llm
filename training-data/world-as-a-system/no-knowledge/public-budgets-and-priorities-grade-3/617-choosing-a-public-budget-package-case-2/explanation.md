# Explanation 617 — Choosing a public budget package: case 2

## Explanation

1. The budget is 17 units and no project is mandatory.
2. A plan is feasible only when the costs of its projects sum to at most 17, and among the feasible plans the greatest benefit wins; the best benefit turns out to be 24.
3. Among the plans reaching 24, the cheapest one is tree planting, bridge repair, drainage with cost 16, so no higher-benefit feasible package exists.

Reference solution as printed in the source (family C6, 4 steps):

1. Budget limit is 17.
2. Evaluate feasible combinations (and keep the mandatory project if any).
3. The best feasible combination has cost 16 and benefit 24: ['tree planting', 'bridge repair', 'drainage'].
4. No higher-benefit feasible combination exists under the stated costs. Cross-domain check: 8+2=10, so the team finishes at 10:00.

## Result

**Answer.** Choose tree planting, bridge repair, drainage; cost 16, benefit 24. Cross-domain answer: 10:00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
