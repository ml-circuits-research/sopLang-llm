# Explanation 872 — Pairwise collective choice: Library versus Sports Hall

## Explanation

1. The contest is Library against Sports Hall, and each voter group gives all of its voters to the option it ranks higher.
2. Reading the ranked lists gives Library=12 and Sports Hall=3, because the third option never enters this comparison.
3. The larger total belongs to Library, which therefore wins the pairwise contest.

Reference solution as printed in the source (family C7, 3 steps):

1. For each group, check whether Library or Sports Hall is ranked higher.
2. Totals: Library=12, Sports Hall=3.
3. Therefore the result is Library.

## Result

**Answer.** Library wins 12 to 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
