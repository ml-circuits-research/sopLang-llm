# Explanation 1.9 — Who Has the Longest Object? 4

## Explanation

1. Each comparison is a direct inequality about ribbon length over the owners: Sofia > Tudor, Vlad < Tudor, Ioana > Sofia.
2. Reading the comparisons transitively places one owner above all others and one below all others.
3. The owner that is longer than every other owner is the longest, and the owner that is shorter than every other owner is the shortest.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Ioana has a longer ribbon than Sofia.
2. Sofia has a longer one than Tudor; therefore Ioana’s is longer than both of theirs.
3. Vlad’s is shorter than Tudor’s; therefore Vlad is below everyone else in the ordering.
4. The order of the ribbon lengths is Ioana > Sofia > Tudor > Vlad.

## Result

**Answer.** Longest: Ioana. Shortest: Vlad.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
