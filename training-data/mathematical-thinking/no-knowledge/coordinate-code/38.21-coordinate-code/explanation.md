# Explanation 38.21 — Coordinate code

## Explanation

1. The format fixes the meaning of each position: the first digit is the row and the second is the column.
2. Splitting 37 according to that format gives row 3 and column 7.

Reference solution as printed in the source (chapter 38, 4 steps):

1. The first position means “row.”
2. Its value is 3.
3. The second means “column” and has value 7.
4. Code 37 represents (3,7).

## Result

**Answer.** Row 3, column 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
