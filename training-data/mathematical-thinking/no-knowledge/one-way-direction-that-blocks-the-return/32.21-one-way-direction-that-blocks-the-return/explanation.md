# Explanation 32.21 — One-way direction that blocks the return

## Explanation

1. Because every road is one-way, a route exists only when its arrows allow travelling from the start to the destination.
2. Searching along the arrows decides which of the questions A→C and C→A can be answered yes.

Reference solution as printed in the source (chapter 32, 4 steps):

1. A reaches B and then C.
2. To return, arcs leaving C would be needed.
3. No such arc is given.
4. Directed connectivity can differ in the two directions.

## Result

**Answer.** A→C: yes; C→A: no.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
