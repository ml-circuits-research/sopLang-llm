# Explanation 27.14 — A cumulative value

## Explanation

1. A cumulative value over several days is the sum of the daily values, because each item belongs to exactly one day.
2. Adding Monday=3, Tuesday=5, Wednesday=4 gives 12 products.

Reference solution as printed in the source (chapter 27, 4 steps):

1. Add Monday and Tuesday: 3+5=8.
2. Add Wednesday: 8+4=12.
3. Each product is assigned to exactly one day.
4. The total is 12.

## Result

**Answer.** 12 products.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
