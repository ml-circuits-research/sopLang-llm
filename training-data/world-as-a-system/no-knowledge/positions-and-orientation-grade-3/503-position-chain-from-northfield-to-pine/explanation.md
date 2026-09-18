# Explanation 503 — Position chain from Northfield to Pine

## Explanation

1. Start Northfield at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Northfield to Pine adds up to (1,2).
3. That coordinate places Pine north-east of Northfield, and the grid displacement is |1|+|2|=3.
4. The museum sentence changes no coordinate, so it is a distractor.

Reference solution as printed in the source (family G1, 5 steps):

1. Start Northfield at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (1,2).
4. That coordinate is north-east of Northfield; the grid displacement is |1|+|2|=3.
5. The museum sentence changes no coordinate, so it is a distractor.

## Result

**Answer.** Pine is north-east of Northfield; grid displacement 3 unit(s). The museum fact is irrelevant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
