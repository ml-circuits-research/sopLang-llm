# Explanation 970 — Dominance and multi-criteria trade-offs

## Explanation

1. We do not add scores unless instructed to do so; dominance is a component-by-component comparison over C1 (useful energy), C2 (unwanted heat), C3 (operating time).
2. With the scored options A=(3, 5, 4), B=(5, 3, 3), C=(2, 2, 2), D=(4, 4, 5), the dominance relation found is: C is dominated by A.
3. The non-dominated frontier is {A, B, D}: no option on it is at least as good as another on every criterion while being strictly better somewhere.
4. Several candidates remain, each making different trade-offs; without added priorities, there is no unique logical winner.

Reference solution as printed in the source (form 40, 4 steps):

1. We do not add scores unless instructed to do so; dominance is a component-by-component comparison.
2. The dominance relations found are: C is dominated by A.
3. The non-dominated frontier is {A, B, D}.
4. Several candidates remain, each making different trade-offs; without added priorities, there is no unique logical winner.

## Result

**Answer.** Eliminate C; non-dominated frontier: A, B, D. There is no unique winner without additional criteria.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
