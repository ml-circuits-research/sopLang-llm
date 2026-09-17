# Explanation 32.9 — Two separate components

## Explanation

1. A group holds nodes that can travel to each other along links, so two nodes share a group exactly when some path joins them.
2. Walking the links from every unvisited node discovers 2 groups, because no link crosses between them.

Reference solution as printed in the source (chapter 32, 4 steps):

1. A, B, C are connected to one another.
2. D, E are connected to one another.
3. There is no link between the two groups.
4. Therefore there are two components.

## Result

**Answer.** 2 groups.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
