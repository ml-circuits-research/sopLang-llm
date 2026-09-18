# Explanation 755 — Position chain from Quartz to Alder

## Explanation

1. Start Quartz at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Quartz to Alder adds up to (0,0).
3. That coordinate places Alder the same position of Quartz, and the grid displacement is |0|+|0|=0.
4. The museum sentence changes no coordinate, so it is a distractor.

Reference solution as printed in the source (family G1, 5 steps):

1. Start Quartz at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (0,0).
4. That coordinate is the same position of Quartz; the grid displacement is |0|+|0|=0.
5. The museum sentence changes no coordinate, so it is a distractor.

## Result

**Answer.** Alder is the same position of Quartz; grid displacement 0 unit(s). The museum fact is irrelevant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
