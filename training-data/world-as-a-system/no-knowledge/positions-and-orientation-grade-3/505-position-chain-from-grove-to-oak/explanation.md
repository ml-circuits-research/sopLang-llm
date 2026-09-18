# Explanation 505 — Position chain from Grove to Oak

## Explanation

1. Start Grove at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Grove to Oak adds up to (1,0).
3. That coordinate places Oak east of Grove, and the grid displacement is |1|+|0|=1.
4. The museum sentence changes no coordinate, so it is a distractor.

Reference solution as printed in the source (family G1, 5 steps):

1. Start Grove at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (1,0).
4. That coordinate is east of Grove; the grid displacement is |1|+|0|=1.
5. The museum sentence changes no coordinate, so it is a distractor.

## Result

**Answer.** Oak is east of Grove; grid displacement 1 unit(s). The museum fact is irrelevant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
