# Explanation 252 — Position chain from Zephyr to Juniper

## Explanation

1. Start Zephyr at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Zephyr to Juniper adds up to (0,4).
3. That coordinate places Juniper north of Zephyr, and the grid displacement is |0|+|4|=4.

Reference solution as printed in the source (family G1, 4 steps):

1. Start Zephyr at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (0,4).
4. That coordinate is north of Zephyr; the grid displacement is |0|+|4|=4.

## Result

**Answer.** Juniper is north of Zephyr; grid displacement 4 unit(s).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
