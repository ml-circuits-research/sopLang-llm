# Explanation 14.2 — Area of a Rectangle 2

## Explanation

1. The statement defines area as the number of unit squares that cover the rectangle, and it states that the area of a rectangle is length×width.
2. The measured rectangle has sides 9 and 6, so the covering is 9 rows of 6 unit squares.
3. Multiplying the two side lengths gives 54 square units, which is exactly the number of unit squares counted row by row.

Reference solution as printed in the source (chapter 14, 2 steps):

1. Each row has 9 squares.
2. There are 6 rows: 6×9=54.

## Result

**Answer.** 54 square units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
