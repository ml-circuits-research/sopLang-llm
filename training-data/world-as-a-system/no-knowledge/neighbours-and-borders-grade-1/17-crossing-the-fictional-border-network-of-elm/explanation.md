# Explanation 17 — Crossing the fictional border network of Elm

## Explanation

1. Each shared border is an undirected link, so the network has 6 links over the listed states.
2. A breadth-first search from Elm reaches Yarrow in 3 links, which is the fewest border crossings.
3. Deleting Iris leaves Yarrow reachable from Elm, so the state is avoidable on at least one route.

Reference solution as printed in the source (family G4, 4 steps):

1. Turn each shared border into an undirected link.
2. A shortest-link search gives distance 3 from Elm to Yarrow.
3. Remove Iris and check whether Yarrow is still reachable from Elm.
4. It is still reachable, so Iris is not unavoidable.

## Result

**Answer.** 3 border crossing(s); Iris is not unavoidable.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
