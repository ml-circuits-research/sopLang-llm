# Explanation 873 — Pairwise collective choice: Park versus Sports Hall

## Explanation

1. The contest is Park against Sports Hall, and each voter group gives all of its voters to the option it ranks higher.
2. Reading the ranked lists gives Park=6 and Sports Hall=11, because the third option never enters this comparison.
3. The larger total belongs to Sports Hall, which therefore wins the pairwise contest.

Reference solution as printed in the source (family C7, 3 steps):

1. For each group, check whether Park or Sports Hall is ranked higher.
2. Totals: Park=6, Sports Hall=11.
3. Therefore the result is Sports Hall.

## Result

**Answer.** Sports Hall wins 11 to 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
