# Explanation 21.12 — The Redundant Clue

## Explanation

1. The first two clues narrow the candidates 3, 6, 9, 12 down to 6, 9.
2. A clue is useless when it removes none of the surviving candidates.
3. Applying clue 3 leaves those candidates unchanged, so it adds no information.

Reference solution as printed in the source (chapter 21, 4 steps):

1. Clue 1 eliminates 3 and leaves 6, 9, 12.
2. Clue 2 eliminates 12 and leaves 6, 9.
3. Both remaining numbers are already less than 20.
4. Clue 3 eliminates no candidate, so it is redundant.

## Result

**Answer.** Clue 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
