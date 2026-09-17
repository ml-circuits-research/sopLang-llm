# Explanation 25.7 — A repeating two-dimensional pattern

## Explanation

1. On a checkerboard every step to a side-neighbour flips the color, so a cell keeps the color of the top-left cell exactly when the number of steps is even.
2. Moving from row 1 column 1 to row 3 column 3 takes 2 vertical and 2 horizontal steps, 4 steps in total.
3. That number is even, so the cell has the same color as the top-left cell: white.

Reference solution as printed in the source (chapter 25, 4 steps):

1. The first row is white, black, white.
2. The second begins with black: black, white, black.
3. The third repeats the first pattern: white, black, white.
4. Cell (3,3) is white.

## Result

**Answer.** White.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
