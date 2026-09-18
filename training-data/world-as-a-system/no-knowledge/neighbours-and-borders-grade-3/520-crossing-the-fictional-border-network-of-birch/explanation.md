# Explanation 520 — Crossing the fictional border network of Birch

## Explanation

1. Each shared border is an undirected link, so the network has 5 links over the listed states.
2. A breadth-first search from Birch reaches Riverbend in 3 links, which is the fewest border crossings.
3. Deleting Oak leaves Riverbend unreachable from Birch, so the state is crossed by every route.

Reference solution as printed in the source (family G4, 4 steps):

1. Turn each shared border into an undirected link.
2. A shortest-link search gives distance 3 from Birch to Riverbend.
3. Remove Oak and check whether Riverbend is still reachable from Birch.
4. It is not reachable, so Oak is unavoidable.

## Result

**Answer.** 3 border crossing(s); Oak is unavoidable.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
