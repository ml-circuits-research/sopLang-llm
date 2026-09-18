# Explanation 875 — Pairwise collective choice: Sports Hall versus Park

## Explanation

1. The contest is Sports Hall against Park, and each voter group gives all of its voters to the option it ranks higher.
2. Reading the ranked lists gives Sports Hall=13 and Park=8, because the third option never enters this comparison.
3. The larger total belongs to Sports Hall, which therefore wins the pairwise contest.

Reference solution as printed in the source (family C7, 3 steps):

1. For each group, check whether Sports Hall or Park is ranked higher.
2. Totals: Sports Hall=13, Park=8.
3. Therefore the result is Sports Hall.

## Result

**Answer.** Sports Hall wins 13 to 8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
