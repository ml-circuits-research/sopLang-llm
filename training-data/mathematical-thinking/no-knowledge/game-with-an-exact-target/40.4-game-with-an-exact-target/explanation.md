# Explanation 40.4 — Game with an exact target

## Explanation

1. The game starts at 0 and the winner is the player who reaches exactly 7, so a position of 5 is winning when the remaining distance is an allowed increment.
2. The remaining distance is 7 - 5 = 2, and 2 is one of the allowed adds (1 or 2).
3. The immediate winning move is therefore to add 2 and reach 7 exactly.

Reference solution as printed in the source (chapter 40, 4 steps):

1. The allowed moves are +1 or +2.
2. From 5, +2 reaches exactly 7.
3. Reaching the target ends the game with a win.
4. Therefore no later plan is needed.

## Result

**Answer.** Yes: add 2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
