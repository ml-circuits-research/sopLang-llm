# Explanation 752 — Position chain from Dover to Linden

## Explanation

1. Start Dover at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Dover to Linden adds up to (0,4).
3. That coordinate places Linden north of Dover, and the grid displacement is |0|+|4|=4.
4. The museum sentence changes no coordinate, so it is a distractor.

Reference solution as printed in the source (family G1, 5 steps):

1. Start Dover at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (0,4).
4. That coordinate is north of Dover; the grid displacement is |0|+|4|=4.
5. The museum sentence changes no coordinate, so it is a distractor.

## Result

**Answer.** Linden is north of Dover; grid displacement 4 unit(s). The museum fact is irrelevant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
