# Explanation 767 — Crossing the fictional border network of Kite

## Explanation

1. Each shared border is an undirected link, so the network has 5 links over the listed states.
2. A breadth-first search from Kite reaches Harbor in 3 links, which is the fewest border crossings.
3. Deleting Fern leaves Harbor unreachable from Kite, so the state is crossed by every route.

Reference solution as printed in the source (family G4, 4 steps):

1. Turn each shared border into an undirected link.
2. A shortest-link search gives distance 3 from Kite to Harbor.
3. Remove Fern and check whether Harbor is still reachable from Kite.
4. It is not reachable, so Fern is unavoidable.

## Result

**Answer.** 3 border crossing(s); Fern is unavoidable.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
