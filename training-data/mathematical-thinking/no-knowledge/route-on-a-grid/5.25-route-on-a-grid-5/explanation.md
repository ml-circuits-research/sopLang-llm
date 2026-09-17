# Explanation 5.25 — Route on a Grid 5

## Explanation

1. Each move goes to exactly one neighboring square, either horizontally or vertically, and the robot never moves backward.
2. Reaching 3 squares to the right costs 3 horizontal moves and reaching 4 squares upward costs 4 vertical moves.
3. Because no move is wasted or repeated, the total is independent of the order: 3 + 4 = 7 moves.

Reference solution as printed in the source (chapter 5, 4 steps):

1. The horizontal displacement requires 3 moves.
2. The vertical displacement requires 4 moves.
3. With no backward steps, these moves add together: 3+4=7.
4. Their order may vary, but the total number does not change.

## Result

**Answer.** 7 moves.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
