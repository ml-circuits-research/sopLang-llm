# Explanation 5.22 — Route on a Grid 2

## Explanation

1. Each move goes to exactly one neighboring square, either horizontally or vertically, and the robot never moves backward.
2. Reaching 4 squares to the right costs 4 horizontal moves and reaching 1 squares upward costs 1 vertical moves.
3. Because no move is wasted or repeated, the total is independent of the order: 4 + 1 = 5 moves.

Reference solution as printed in the source (chapter 5, 4 steps):

1. The horizontal displacement requires 4 moves.
2. The vertical displacement requires 1 move.
3. With no backward steps, these moves add together: 4+1=5.
4. Their order may vary, but the total number does not change.

## Result

**Answer.** 5 moves.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
