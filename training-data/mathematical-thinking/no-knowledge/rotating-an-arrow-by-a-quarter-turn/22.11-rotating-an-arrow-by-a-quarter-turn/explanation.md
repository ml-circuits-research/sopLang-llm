# Explanation 22.11 — Rotating an arrow by a quarter-turn

## Explanation

1. The stated cycle fixes where one quarter-turn sends each direction: east→north→west→south.
2. Starting at east and advancing 1 place(s) in the cycle gives north.

Reference solution as printed in the source (chapter 22, 4 steps):

1. The starting direction is east.
2. A counterclockwise quarter-turn moves one position along the stated cycle.
3. East therefore becomes north.
4. No information about distance or position is needed.

## Result

**Answer.** North.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
