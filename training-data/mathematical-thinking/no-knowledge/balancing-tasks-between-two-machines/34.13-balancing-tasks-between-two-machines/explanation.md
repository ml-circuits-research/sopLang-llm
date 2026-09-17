# Explanation 34.13 — Balancing tasks between two machines

## Explanation

1. The 4 tasks split into two groups, and the finishing time of a split is the larger group total.
2. Trying every split shows the best achievable finishing time is 9 minutes; the total 16 gives the lower bound of half of it, which cannot be reached exactly.
3. A finishing time of 8 minutes is below the best split, so 8 is impossible.

Reference solution as printed in the source (chapter 34, 4 steps):

1. The total is 16, so less than 8 per machine is impossible; achieving 8 would require exactly 8 and 8.
2. No combination of 6, 4, 3, 3 sums to 8.
3. The split 6+3=9 and 4+3=7 is possible.
4. Therefore the minimum is not 8 but 9.

## Result

**Answer.** 8 is impossible; the minimum time is 9 minutes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
