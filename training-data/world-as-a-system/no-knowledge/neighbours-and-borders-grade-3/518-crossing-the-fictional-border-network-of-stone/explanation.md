# Explanation 518 — Crossing the fictional border network of Stone

## Explanation

1. Each shared border is an undirected link, so the network has 6 links over the listed states.
2. A breadth-first search from Stone reaches Birch in 3 links, which is the fewest border crossings.
3. Deleting Kite leaves Birch reachable from Stone, so the state is avoidable on at least one route.

Reference solution as printed in the source (family G4, 4 steps):

1. Turn each shared border into an undirected link.
2. A shortest-link search gives distance 3 from Stone to Birch.
3. Remove Kite and check whether Birch is still reachable from Stone.
4. It is still reachable, so Kite is not unavoidable.

## Result

**Answer.** 3 border crossing(s); Kite is not unavoidable.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
