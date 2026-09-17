# Explanation 8.8 — How Many Packages? 3

## Explanation

1. The problem defines the number of packages as how many times 6 can be subtracted from 30 before reaching zero.
2. Repeated subtraction succeeds 5 times, since 6×5 = 30.
3. Because nothing remains, 30 pencils fill exactly 5 packages of 6.

Reference solution as printed in the source (chapter 8, 3 steps):

1. Each package uses 6 pencils.
2. 6×5=30, so 5 packages use exactly all the pencils.
3. There is no remainder, so the grouping is exact.

## Result

**Answer.** 5 packages.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
