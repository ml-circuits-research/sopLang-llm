# Explanation 5.23 — Route on a Grid 3

## Explanation

1. Each move goes to exactly one neighboring square, either horizontally or vertically, and the robot never moves backward.
2. Reaching 2 squares to the right costs 2 horizontal moves and reaching 4 squares upward costs 4 vertical moves.
3. Because no move is wasted or repeated, the total is independent of the order: 2 + 4 = 6 moves.

Reference solution as printed in the source (chapter 5, 4 steps):

1. The horizontal displacement requires 2 moves.
2. The vertical displacement requires 4 moves.
3. With no backward steps, these moves add together: 2+4=6.
4. Their order may vary, but the total number does not change.

## Result

**Answer.** 6 moves.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
