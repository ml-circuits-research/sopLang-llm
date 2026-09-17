# Explanation 32.25 — Critical node in a network

## Explanation

1. Removing B also removes every link that touches it, so the network falls into separate pieces.
2. After the removal A can no longer reach C or D: B was the only node joining them.

Reference solution as printed in the source (chapter 32, 4 steps):

1. A was connected only to B.
2. C was connected only to B in the relevant part of the network.
3. D was connected only to B.
4. Removing B breaks every path between these nodes.

## Result

**Answer.** No; A can no longer reach C or D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
