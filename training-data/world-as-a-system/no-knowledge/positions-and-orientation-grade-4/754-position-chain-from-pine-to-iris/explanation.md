# Explanation 754 — Position chain from Pine to Iris

## Explanation

1. Start Pine at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Pine to Iris adds up to (-2,-2).
3. That coordinate places Iris south-west of Pine, and the grid displacement is |-2|+|-2|=4.
4. The museum sentence changes no coordinate, so it is a distractor.

Reference solution as printed in the source (family G1, 5 steps):

1. Start Pine at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (-2,-2).
4. That coordinate is south-west of Pine; the grid displacement is |-2|+|-2|=4.
5. The museum sentence changes no coordinate, so it is a distractor.

## Result

**Answer.** Iris is south-west of Pine; grid displacement 4 unit(s). The museum fact is irrelevant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
