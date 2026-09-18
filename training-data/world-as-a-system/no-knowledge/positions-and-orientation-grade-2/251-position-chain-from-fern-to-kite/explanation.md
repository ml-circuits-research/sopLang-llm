# Explanation 251 — Position chain from Fern to Kite

## Explanation

1. Start Fern at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Fern to Kite adds up to (2,0).
3. That coordinate places Kite east of Fern, and the grid displacement is |2|+|0|=2.

Reference solution as printed in the source (family G1, 4 steps):

1. Start Fern at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (2,0).
4. That coordinate is east of Fern; the grid displacement is |2|+|0|=2.

## Result

**Answer.** Kite is east of Fern; grid displacement 2 unit(s).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
