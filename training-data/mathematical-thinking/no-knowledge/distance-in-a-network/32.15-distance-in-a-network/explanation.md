# Explanation 32.15 — Distance in a network

## Explanation

1. The distance is the minimum number of links between the two nodes, so it is the number of edges of a shortest path.
2. Travelling along the chain from B to E takes 3 links, and no route uses fewer.

Reference solution as printed in the source (chapter 32, 4 steps):

1. The available path is B-C-D-E.
2. Count the links: B-C one, C-D two, D-E three.
3. No shortcut is given.
4. The distance is 3.

## Result

**Answer.** 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
