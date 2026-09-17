# Explanation 4.14 — Position in a Repeating Pattern 4

## Explanation

1. The pattern repeats as star, moon, sun, moon, so the elements are grouped into cycles of 4.
2. Counting complete cycles up to position 14 leaves a remainder, and the remainder fixes the element inside one cycle.
3. Position 14 falls on index 2 of the cycle, which is moon.

Reference solution as printed in the source (chapter 4, 4 steps):

1. One cycle has 4 elements.
2. The first 3 complete cycles contain 12 positions.
3. Position 14 corresponds to position 2 in the cycle.
4. That element is “moon.”

## Result

**Answer.** moon

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
