# Explanation 22.22 — Ordering landmarks along a path

## Explanation

1. Walking away from the start means meeting landmarks in increasing order of their measured positions.
2. The positions fountain=3, bridge=8, oak tree=5 sort into the order the walker meets them.

Reference solution as printed in the source (chapter 22, 4 steps):

1. The fountain is at position 3.
2. The oak tree is at position 5.
3. The bridge is at position 8.
4. Increasing positions give the order encountered from the start.

## Result

**Answer.** Fountain, oak tree, bridge.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
