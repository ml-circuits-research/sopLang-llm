# Explanation 31.2 — A certain event

## Explanation

1. An event is certain when every possible outcome satisfies it, so certainty is decided by comparing the favorable outcomes with the whole outcome space.
2. All 5 balls in the bag are green, so every outcome satisfies "the ball is green".
3. The event is therefore certain, and the probability is 1.

Reference solution as printed in the source (chapter 31, 4 steps):

1. Any chosen ball is one of the 5.
2. All 5 are green.
3. There is no unfavorable outcome.
4. The event is certain.

## Result

**Answer.** Yes; the probability is 1.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
