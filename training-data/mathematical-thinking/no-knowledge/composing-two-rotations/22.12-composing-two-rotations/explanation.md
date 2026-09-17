# Explanation 22.12 — Composing two rotations

## Explanation

1. A left turn and a right turn are opposites, so a left-turn cycle runs the cardinal directions in the reverse order of a right-turn cycle.
2. Following the stated cycle from west for 2 left turn(s) lands on east.

Reference solution as printed in the source (chapter 22, 4 steps):

1. First turn: west→south.
2. Second turn: south→east.
3. Two quarter-turns in the same direction make a half-turn.
4. The direction opposite west is east.

## Result

**Answer.** East.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
