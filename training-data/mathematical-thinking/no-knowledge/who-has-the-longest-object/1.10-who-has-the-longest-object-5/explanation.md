# Explanation 1.10 — Who Has the Longest Object? 5

## Explanation

1. Each comparison is a direct inequality about ribbon length over the owners: Tudor > Vlad, Ilinca < Vlad, Sofia > Tudor.
2. Reading the comparisons transitively places one owner above all others and one below all others.
3. The owner that is longer than every other owner is the longest, and the owner that is shorter than every other owner is the shortest.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Sofia has a longer ribbon than Tudor.
2. Tudor has a longer one than Vlad; therefore Sofia’s is longer than both of theirs.
3. Ilinca’s is shorter than Vlad’s; therefore Ilinca is below everyone else in the ordering.
4. The order of the ribbon lengths is Sofia > Tudor > Vlad > Ilinca.

## Result

**Answer.** Longest: Sofia. Shortest: Ilinca.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
