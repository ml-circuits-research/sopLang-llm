# Explanation 32.12 — Sum of degrees in a small network

## Explanation

1. The degree of a node is the number of edges that touch it, so each node is counted once per incident edge.
2. The nodes have degrees 2, 2, 2, and adding them gives the total 6.

Reference solution as printed in the source (chapter 32, 4 steps):

1. A touches AB and AC: degree 2.
2. B touches AB and BC: degree 2.
3. C touches AC and BC: degree 2.
4. The sum is 6; each of the 3 edges was counted at both endpoints.

## Result

**Answer.** 2, 2, 2; sum 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
