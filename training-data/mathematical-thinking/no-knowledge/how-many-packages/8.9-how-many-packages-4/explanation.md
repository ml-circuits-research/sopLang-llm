# Explanation 8.9 — How Many Packages? 4

## Explanation

1. The problem defines the number of packages as how many times 8 can be subtracted from 32 before reaching zero.
2. Repeated subtraction succeeds 4 times, since 8×4 = 32.
3. Because nothing remains, 32 pencils fill exactly 4 packages of 8.

Reference solution as printed in the source (chapter 8, 3 steps):

1. Each package uses 8 pencils.
2. 8×4=32, so 4 packages use exactly all the pencils.
3. There is no remainder, so the grouping is exact.

## Result

**Answer.** 4 packages.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
