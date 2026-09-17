# Explanation 32.5 — Shortest path by number of links

## Explanation

1. Counting links amounts to counting edges, so the shortest route is found by exploring the network in widening layers from the start.
2. The first time D is reached its layer is 2, the fewest possible, along A-B-D.

Reference solution as printed in the source (chapter 32, 4 steps):

1. List the obvious paths.
2. A-B-D uses 2 links.
3. A-C-E-D uses 3.
4. 2<3, so the first is shorter.

## Result

**Answer.** A-B-D, with 2 links.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
