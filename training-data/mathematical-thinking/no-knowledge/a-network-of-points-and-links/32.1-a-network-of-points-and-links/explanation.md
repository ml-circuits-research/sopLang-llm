# Explanation 32.1 — A network of points and links

## Explanation

1. A direct link can be travelled in either direction, so the network is an undirected graph whose edges are the printed links.
2. Breadth-first search from A reaches C in the fewest links, through B.

Reference solution as printed in the source (chapter 32, 4 steps):

1. From A we can go directly to B.
2. From B there is a direct link to C.
3. The sequence A-B-C uses only allowed links.
4. Therefore a path exists, even though A and C are not directly linked.

## Result

**Answer.** Yes, through B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
