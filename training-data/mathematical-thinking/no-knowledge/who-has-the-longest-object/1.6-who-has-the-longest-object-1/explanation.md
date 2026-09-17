# Explanation 1.6 — Who Has the Longest Object? 1

## Explanation

1. Each comparison is a direct inequality about ribbon length over the owners: Matei > Radu, Ioana < Radu, Luca > Matei.
2. Reading the comparisons transitively places one owner above all others and one below all others.
3. The owner that is longer than every other owner is the longest, and the owner that is shorter than every other owner is the shortest.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Luca has a longer ribbon than Matei.
2. Matei has a longer one than Radu; therefore Luca’s is longer than both of theirs.
3. Ioana’s is shorter than Radu’s; therefore Ioana is below everyone else in the ordering.
4. The order of the ribbon lengths is Luca > Matei > Radu > Ioana.

## Result

**Answer.** Longest: Luca. Shortest: Ioana.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
