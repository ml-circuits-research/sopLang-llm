# Explanation 27.22 — Total by day from a two-way table

## Explanation

1. A day total of a two-way table adds only the cells of that column, so column Monday is selected first.
2. Its cells are Ana=3, Dan=4, which add up to 7.

Reference solution as printed in the source (chapter 27, 4 steps):

1. On Monday, Ana has 3.
2. On Monday, Dan has 4.
3. Add down the column: 3+4=7.
4. Tuesday's values are not included.

## Result

**Answer.** 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
