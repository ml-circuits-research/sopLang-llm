# Explanation 2 — Position chain from Iris to Pine

## Explanation

1. Start Iris at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Iris to Pine adds up to (0,2).
3. That coordinate places Pine north of Iris, and the grid displacement is |0|+|2|=2.

Reference solution as printed in the source (family G1, 4 steps):

1. Start Iris at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (0,2).
4. That coordinate is north of Iris; the grid displacement is |0|+|2|=2.

## Result

**Answer.** Pine is north of Iris; grid displacement 2 unit(s).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
