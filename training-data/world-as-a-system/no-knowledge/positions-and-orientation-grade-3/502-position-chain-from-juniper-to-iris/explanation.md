# Explanation 502 — Position chain from Juniper to Iris

## Explanation

1. Start Juniper at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Juniper to Iris adds up to (0,2).
3. That coordinate places Iris north of Juniper, and the grid displacement is |0|+|2|=2.
4. The museum sentence changes no coordinate, so it is a distractor.

Reference solution as printed in the source (family G1, 5 steps):

1. Start Juniper at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (0,2).
4. That coordinate is north of Juniper; the grid displacement is |0|+|2|=2.
5. The museum sentence changes no coordinate, so it is a distractor.

## Result

**Answer.** Iris is north of Juniper; grid displacement 2 unit(s). The museum fact is irrelevant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
