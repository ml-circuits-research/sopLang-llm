# Explanation 24.11 — Two intervals that do not overlap

## Explanation

1. Even the largest possible value of A, 11 cm, is below the smallest possible value of B, 12 cm, so the two intervals are separated.
2. No allowed value of A can reach any allowed value of B, so every length compatible with the data makes B longer.

Reference solution as printed in the source (chapter 24, 4 steps):

1. Even the largest possible value for A is below 11.
2. Even the smallest possible value for B is above 12.
3. The intervals are separated.
4. Every allowed value for B is larger than every allowed value for A.

## Result

**Answer.** B is certainly longer.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
