# Explanation 501 — Position chain from Yarrow to Alder

## Explanation

1. Start Yarrow at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Yarrow to Alder adds up to (4,0).
3. That coordinate places Alder east of Yarrow, and the grid displacement is |4|+|0|=4.
4. The museum sentence changes no coordinate, so it is a distractor.

Reference solution as printed in the source (family G1, 5 steps):

1. Start Yarrow at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (4,0).
4. That coordinate is east of Yarrow; the grid displacement is |4|+|0|=4.
5. The museum sentence changes no coordinate, so it is a distractor.

## Result

**Answer.** Alder is east of Yarrow; grid displacement 4 unit(s). The museum fact is irrelevant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
