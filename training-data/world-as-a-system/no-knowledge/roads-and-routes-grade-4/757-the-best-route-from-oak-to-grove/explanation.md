# Explanation 757 — The best route from Oak to Grove

## Explanation

1. The statement lists 3 candidate routes, and the closed road Oak–Fern removes some candidates.
2. Summing the segment costs of every feasible route leaves 15 as the smallest total, on Oak–Dover–Grove.
3. The chosen route is the first feasible route with that smallest total, and no feasible route costs less.

Reference solution as printed in the source (family G2, 4 steps):

1. List the candidate routes and their segment costs.
2. Remove any route containing a closed road.
3. Add the segment costs for every feasible route.
4. The smallest feasible total is 15, on Oak–Dover–Grove.

## Result

**Answer.** Use Oak–Dover–Grove; total cost 15.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
