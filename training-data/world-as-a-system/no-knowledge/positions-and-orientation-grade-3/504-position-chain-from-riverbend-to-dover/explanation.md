# Explanation 504 — Position chain from Riverbend to Dover

## Explanation

1. Start Riverbend at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Riverbend to Dover adds up to (-1,-1).
3. That coordinate places Dover south-west of Riverbend, and the grid displacement is |-1|+|-1|=2.
4. The museum sentence changes no coordinate, so it is a distractor.

Reference solution as printed in the source (family G1, 5 steps):

1. Start Riverbend at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (-1,-1).
4. That coordinate is south-west of Riverbend; the grid displacement is |-1|+|-1|=2.
5. The museum sentence changes no coordinate, so it is a distractor.

## Result

**Answer.** Dover is south-west of Riverbend; grid displacement 2 unit(s). The museum fact is irrelevant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
