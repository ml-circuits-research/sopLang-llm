# Explanation 8.7 — How Many Packages? 2

## Explanation

1. The problem defines the number of packages as how many times 5 can be subtracted from 35 before reaching zero.
2. Repeated subtraction succeeds 7 times, since 5×7 = 35.
3. Because nothing remains, 35 pencils fill exactly 7 packages of 5.

Reference solution as printed in the source (chapter 8, 3 steps):

1. Each package uses 5 pencils.
2. 5×7=35, so 7 packages use exactly all the pencils.
3. There is no remainder, so the grouping is exact.

## Result

**Answer.** 7 packages.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
