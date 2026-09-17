# Explanation 4.11 — Position in a Repeating Pattern 1

## Explanation

1. The pattern repeats as circle, square, triangle, so the elements are grouped into cycles of 3.
2. Counting complete cycles up to position 11 leaves a remainder, and the remainder fixes the element inside one cycle.
3. Position 11 falls on index 2 of the cycle, which is square.

Reference solution as printed in the source (chapter 4, 4 steps):

1. One cycle has 3 elements.
2. The first 3 complete cycles contain 9 positions.
3. Position 11 corresponds to position 2 in the cycle.
4. That element is “square.”

## Result

**Answer.** square

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
