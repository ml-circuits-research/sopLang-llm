# Explanation 621 — Pairwise collective choice: Park versus Library

## Explanation

1. The contest is Park against Library, and each voter group gives all of its voters to the option it ranks higher.
2. Reading the ranked lists gives Park=6 and Library=6, because the third option never enters this comparison.
3. Both options collect the same number of voters, so the pairwise majority ends in a tie.

Reference solution as printed in the source (family C7, 3 steps):

1. For each group, check whether Park or Library is ranked higher.
2. Totals: Park=6, Library=6.
3. Therefore the result is tie.

## Result

**Answer.** tie 6–6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
