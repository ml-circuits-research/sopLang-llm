# Explanation 4 — Position chain from Linden to Willow

## Explanation

1. Start Linden at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Linden to Willow adds up to (-1,-1).
3. That coordinate places Willow south-west of Linden, and the grid displacement is |-1|+|-1|=2.

Reference solution as printed in the source (family G1, 4 steps):

1. Start Linden at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (-1,-1).
4. That coordinate is south-west of Linden; the grid displacement is |-1|+|-1|=2.

## Result

**Answer.** Willow is south-west of Linden; grid displacement 2 unit(s).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
