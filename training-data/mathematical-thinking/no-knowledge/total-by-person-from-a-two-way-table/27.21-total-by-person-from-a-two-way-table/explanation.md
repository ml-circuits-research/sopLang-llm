# Explanation 27.21 — Total by person from a two-way table

## Explanation

1. A row total of a two-way table adds only the cells of that row, so row Ana is selected first.
2. Its cells are Monday=3, Tuesday=5, which add up to 8.

Reference solution as printed in the source (chapter 27, 4 steps):

1. Select only the cells in Ana's row.
2. The values are 3 and 5.
3. 3+5=8.
4. Dan's values do not enter Ana's total.

## Result

**Answer.** 8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
