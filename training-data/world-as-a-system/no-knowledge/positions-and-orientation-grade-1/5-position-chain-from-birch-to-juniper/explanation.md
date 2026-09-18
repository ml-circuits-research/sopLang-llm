# Explanation 5 — Position chain from Birch to Juniper

## Explanation

1. Start Birch at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Birch to Juniper adds up to (1,0).
3. That coordinate places Juniper east of Birch, and the grid displacement is |1|+|0|=1.

Reference solution as printed in the source (family G1, 4 steps):

1. Start Birch at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (1,0).
4. That coordinate is east of Birch; the grid displacement is |1|+|0|=1.

## Result

**Answer.** Juniper is east of Birch; grid displacement 1 unit(s).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
