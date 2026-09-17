# Explanation 1.8 — Who Has the Longest Object? 3

## Explanation

1. Each comparison is a direct inequality about ribbon length over the owners: Ioana > Sofia, Tudor < Sofia, Radu > Ioana.
2. Reading the comparisons transitively places one owner above all others and one below all others.
3. The owner that is longer than every other owner is the longest, and the owner that is shorter than every other owner is the shortest.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Radu has a longer ribbon than Ioana.
2. Ioana has a longer one than Sofia; therefore Radu’s is longer than both of theirs.
3. Tudor’s is shorter than Sofia’s; therefore Tudor is below everyone else in the ordering.
4. The order of the ribbon lengths is Radu > Ioana > Sofia > Tudor.

## Result

**Answer.** Longest: Radu. Shortest: Tudor.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
