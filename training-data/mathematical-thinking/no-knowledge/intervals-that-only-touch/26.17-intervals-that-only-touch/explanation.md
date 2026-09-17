# Explanation 26.17 — Intervals that only touch

## Explanation

1. A runs up to 12:00 and B starts exactly at 12:00, so the two intervals meet at that single instant.
2. The problem defines overlap as a positive amount of shared running time, and here that duration is 0 minutes.
3. A single instant is not a positive amount of time, so by the given definition the activities do not overlap.

Reference solution as printed in the source (chapter 26, 4 steps):

1. The only common point is 12:00.
2. Immediately before 12:00, only A is running.
3. Immediately after 12:00, only B is running.
4. There is no common interval with positive duration.

## Result

**Answer.** No, according to the given definition.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
