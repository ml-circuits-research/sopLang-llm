# Explanation 32.23 — A path with more edges can be cheaper

## Explanation

1. The direct link costs 10, while the route through B-C costs 2 + 2 + 2.
2. Comparing the two totals shows the longer route is cheaper, at 6.

Reference solution as printed in the source (chapter 32, 4 steps):

1. The direct path has only one edge, but costs 10.
2. The path with three edges costs 2+2+2=6.
3. The number of edges is greater, but the total cost is lower.
4. Optimizing by cost selects the indirect route.

## Result

**Answer.** A-B-C-D, cost 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
