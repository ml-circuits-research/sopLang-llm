# Explanation 866 — Choosing a public budget package: case 1

## Explanation

1. The budget is 18 units and no project is mandatory.
2. A plan is feasible only when the costs of its projects sum to at most 18, and among the feasible plans the greatest benefit wins; the best benefit turns out to be 26.
3. Among the plans reaching 26, the cheapest one is park, bridge repair, library books, drainage with cost 18, so no higher-benefit feasible package exists.

Reference solution as printed in the source (family C6, 4 steps):

1. Budget limit is 18.
2. Evaluate feasible combinations (and keep the mandatory project if any).
3. The best feasible combination has cost 18 and benefit 26: ['park', 'bridge repair', 'library books', 'drainage'].
4. No higher-benefit feasible combination exists under the stated costs. Cross-domain check: compare 8 with 6; 8≥6 is true.

## Result

**Answer.** Choose park, bridge repair, library books, drainage; cost 18, benefit 26. Cross-domain answer: quorum is met.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
