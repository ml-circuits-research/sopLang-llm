# Explanation 1 — Position chain from Cedar to Alder

## Explanation

1. Start Cedar at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Cedar to Alder adds up to (2,0).
3. That coordinate places Alder east of Cedar, and the grid displacement is |2|+|0|=2.

Reference solution as printed in the source (family G1, 4 steps):

1. Start Cedar at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (2,0).
4. That coordinate is east of Cedar; the grid displacement is |2|+|0|=2.

## Result

**Answer.** Alder is east of Cedar; grid displacement 2 unit(s).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
