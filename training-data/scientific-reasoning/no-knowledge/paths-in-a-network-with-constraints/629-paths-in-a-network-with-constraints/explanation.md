# Explanation 629 — Paths in a network with constraints

## Explanation

1. The closed link the clover bed–the insect shelter is removed from the network, so no allowed route may use it.
2. The remaining routes are enumerated and their edge costs added: the allowed route with the smallest sum is the lavender bed → the clover bed → the mint corner → the insect shelter, at total cost 4.
3. Two allowed routes reach the destination at this cheapest cost and the statement does not say which one to print, so the route whose edges come first in the printed list is reported.
4. Counting nodes instead of adding costs would prefer a route with fewer stops that costs more, which the question rules out.
5. Every other allowed route costs the same or more, and a route that used the closed link is not a candidate at all.

Reference solution as printed in the source (form 29, 4 steps):

1. We remove from the graph the closed link the clover bed–the insect shelter.
2. We list the plausible short routes and we add the cost of each edge.
3. The minimum-cost route is the lavender bed → the central path → the mint corner → the insect shelter with cost 4.
4. Any allowed alternative route has an equal or greater cost; a route that uses the closed link is not a valid candidate.

**Source answer.** The minimum-cost path is the lavender bed → the central path → the mint corner → the insect shelter, total cost 4. — the task admits several allowed routes of the same cheapest cost and the source prints one of them The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** The minimum-cost path is the lavender bed → the clover bed → the mint corner → the insect shelter, total cost 4.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
