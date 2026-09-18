# Explanation 8 — The best route from Alder to Oak

## Explanation

1. The statement lists 3 candidate routes, and no road is closed.
2. Summing the segment costs of every feasible route leaves 11 as the smallest total, on Alder–Northfield–Oak.
3. The chosen route is the first feasible route with that smallest total, and no feasible route costs less.

Reference solution as printed in the source (family G2, 4 steps):

1. List the candidate routes and their segment costs.
2. All listed routes are open.
3. Add the segment costs for every feasible route.
4. The smallest feasible total is 11, on Alder–Northfield–Oak.

## Result

**Answer.** Use Alder–Northfield–Oak; total cost 11.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
