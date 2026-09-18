# Explanation 905 — Dominance and multi-criteria trade-offs

## Explanation

1. We do not add scores unless instructed to do so; dominance is a component-by-component comparison over C1 (motion control), C2 (the effort necessary), C3 (stability).
2. With the scored options A=(5, 3, 3), B=(4, 5, 2), C=(3, 4, 5), D=(2, 3, 2), the dominance relation found is: D is dominated by A.
3. The non-dominated frontier is {A, B, C}: no option on it is at least as good as another on every criterion while being strictly better somewhere.
4. Several candidates remain, each making different trade-offs; without added priorities, there is no unique logical winner.

Reference solution as printed in the source (form 40, 4 steps):

1. We do not add scores unless instructed to do so; dominance is a component-by-component comparison.
2. The dominance relations found are: D is dominated by A.
3. The non-dominated frontier is {A, B, C}.
4. Several candidates remain, each making different trade-offs; without added priorities, there is no unique logical winner.

## Result

**Answer.** Eliminate D; non-dominated frontier: A, B, C. There is no unique winner without additional criteria.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
