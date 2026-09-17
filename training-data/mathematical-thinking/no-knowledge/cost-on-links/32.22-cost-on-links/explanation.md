# Explanation 32.22 — Cost on links

## Explanation

1. With costs on the links the cheapest route is not always the one with the fewest links, so every simple route is compared by total cost.
2. Adding the costs along each route shows A-C-D is cheapest, at a total of 5.

Reference solution as printed in the source (chapter 32, 4 steps):

1. Through B, the cost is 2+5=7.
2. Through C, the cost is 4+1=5.
3. Compare the sums, not the number of edges, because both paths have two.
4. 5<7.

## Result

**Answer.** A-C-D, cost 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
