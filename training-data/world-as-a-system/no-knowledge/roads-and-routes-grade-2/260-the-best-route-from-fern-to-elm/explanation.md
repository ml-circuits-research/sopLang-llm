# Explanation 260 — The best route from Fern to Elm

## Explanation

1. The statement lists 3 candidate routes, and no road is closed.
2. Summing the segment costs of every feasible route leaves 17 as the smallest total, on Fern–Harbor–Elm.
3. The chosen route is the first feasible route with that smallest total, and no feasible route costs less.

Reference solution as printed in the source (family G2, 4 steps):

1. List the candidate routes and their segment costs.
2. All listed routes are open.
3. Add the segment costs for every feasible route.
4. The smallest feasible total is 17, on Fern–Harbor–Elm.

## Result

**Answer.** Use Fern–Harbor–Elm; total cost 17.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
