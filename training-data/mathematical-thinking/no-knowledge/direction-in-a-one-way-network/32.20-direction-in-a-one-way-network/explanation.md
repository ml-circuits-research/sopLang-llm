# Explanation 32.20 — Direction in a one-way network

## Explanation

1. The arrows make the moves one-directional, so a road may be used only from its tail to its head.
2. Following the arrows from B leads through C to A.

Reference solution as printed in the source (chapter 32, 4 steps):

1. From B we can go to C.
2. From C there is an arrow to A.
3. The sequence follows the direction of both arcs.
4. So B reaches A in two stages.

## Result

**Answer.** Yes, through C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
