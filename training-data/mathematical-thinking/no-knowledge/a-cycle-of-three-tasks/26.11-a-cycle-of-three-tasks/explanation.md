# Explanation 26.11 — A cycle of three tasks

## Explanation

1. The written sequence repeats, and the shortest block that is copied over and over is A, B, C, of length 3.
2. Step 20 has the same task as position 2 of that block, because 19 modulo 3 removes the completed blocks.
3. Position 2 holds B.

Reference solution as printed in the source (chapter 26, 4 steps):

1. The first 18 positions form 6 complete cycles.
2. Position 19 starts again with A.
3. Position 20 is B.
4. Remainder 2 indicates the second state in the cycle.

## Result

**Answer.** B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
