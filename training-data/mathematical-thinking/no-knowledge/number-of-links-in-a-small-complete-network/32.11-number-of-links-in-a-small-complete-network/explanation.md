# Explanation 32.11 — Number of links in a small complete network

## Explanation

1. Every link is a pair of distinct nodes, and each of the 4 nodes is paired with the other 3.
2. Counting each pair once halves the 12 ordered joins, giving 6 links.

Reference solution as printed in the source (chapter 32, 4 steps):

1. A links to B, C, D: 3.
2. B adds new links to C, D: 2.
3. C adds one more to D.
4. 3+2+1=6.

## Result

**Answer.** 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
