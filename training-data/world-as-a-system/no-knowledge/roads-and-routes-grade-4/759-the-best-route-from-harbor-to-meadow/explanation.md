# Explanation 759 — The best route from Harbor to Meadow

## Explanation

1. The statement lists 3 candidate routes, and the closed road Harbor–Iris removes some candidates.
2. Summing the segment costs of every feasible route leaves 19 as the smallest total, on Harbor–Riverbend–Meadow.
3. The chosen route is the first feasible route with that smallest total, and no feasible route costs less.

Reference solution as printed in the source (family G2, 4 steps):

1. List the candidate routes and their segment costs.
2. Remove any route containing a closed road.
3. Add the segment costs for every feasible route.
4. The smallest feasible total is 19, on Harbor–Riverbend–Meadow.

## Result

**Answer.** Use Harbor–Riverbend–Meadow; total cost 19.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
