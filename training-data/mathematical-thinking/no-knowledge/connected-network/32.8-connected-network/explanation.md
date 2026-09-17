# Explanation 32.8 — Connected network

## Explanation

1. A network is connected when every node is reachable from every other node, which is the same as having a single group of nodes.
2. Counting the groups of the printed links gives one group, so every node can be reached from every other node.

Reference solution as printed in the source (chapter 32, 4 steps):

1. A can reach B, C, and D by following the chain.
2. B can reach A and also C, D.
3. The same is true for C and D.
4. All nodes belong to the same chain, so the network is connected.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
