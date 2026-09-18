# Explanation 509 — The best route from Elm to Dover

## Explanation

1. The statement lists 3 candidate routes, and the closed road Elm–Iris removes some candidates.
2. Summing the segment costs of every feasible route leaves 17 as the smallest total, on Elm–Meadow–Dover.
3. The chosen route is the first feasible route with that smallest total, and no feasible route costs less.

Reference solution as printed in the source (family G2, 4 steps):

1. List the candidate routes and their segment costs.
2. Remove any route containing a closed road.
3. Add the segment costs for every feasible route.
4. The smallest feasible total is 17, on Elm–Meadow–Dover.

## Result

**Answer.** Use Elm–Meadow–Dover; total cost 17.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
