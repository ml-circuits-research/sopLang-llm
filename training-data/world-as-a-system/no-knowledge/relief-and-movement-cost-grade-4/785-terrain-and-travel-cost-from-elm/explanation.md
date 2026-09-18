# Explanation 785 — Terrain and travel cost from Elm

## Explanation

1. The energy of a route is the sum of the costs of its terrain segments, so the candidates cost R1=5, R2=5, R3=5.
2. A route that spends more than the stated limit of 11 energy units is infeasible and drops out before the choice.
3. R1 is the first feasible route with the smallest energy, 5 units, and no feasible route uses less.

Reference solution as printed in the source (family G7, 3 steps):

1. Compute route totals: R1=5, R2=5, R3=5.
2. Discard any total above 11.
3. The smallest remaining total is R1=5.

## Result

**Answer.** Route R1, using 5 energy units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
