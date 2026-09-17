# Explanation 22.1 — Left and right after a turn

## Explanation

1. The text fixes the turn cycle north→east→south→west→north, so one right turn moves one place forward in that cycle.
2. Starting from north and taking 2 right turn(s) steps forward 2 place(s), landing on south.

Reference solution as printed in the source (chapter 22, 4 steps):

1. After the first turn: north→east.
2. After the second turn: east→south.
3. The robot did not move; only its orientation changed.
4. Two 90° right turns amount to a half-turn, so it faces south.

## Result

**Answer.** South.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
