# Explanation 1.7 — Who Has the Longest Object? 2

## Explanation

1. Each comparison is a direct inequality about ribbon length over the owners: Radu > Ioana, Sofia < Ioana, Matei > Radu.
2. Reading the comparisons transitively places one owner above all others and one below all others.
3. The owner that is longer than every other owner is the longest, and the owner that is shorter than every other owner is the shortest.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Matei has a longer ribbon than Radu.
2. Radu has a longer one than Ioana; therefore Matei’s is longer than both of theirs.
3. Sofia’s is shorter than Ioana’s; therefore Sofia is below everyone else in the ordering.
4. The order of the ribbon lengths is Matei > Radu > Ioana > Sofia.

## Result

**Answer.** Longest: Matei. Shortest: Sofia.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
