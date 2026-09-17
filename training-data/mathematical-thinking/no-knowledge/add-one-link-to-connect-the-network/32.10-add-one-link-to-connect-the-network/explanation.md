# Explanation 32.10 — Add one link to connect the network

## Explanation

1. With 2 separate groups, one link between any node of one group and any node of another merges those two groups.
2. Each link therefore joins two groups, so 1 link joins all the groups into one network.

Reference solution as printed in the source (chapter 32, 4 steps):

1. Paths already exist inside each component.
2. We need to create just one bridge between them.
3. For example, C-D.
4. After adding it, every node in the first group can reach the second through this bridge.

## Result

**Answer.** One link, for example C-D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
