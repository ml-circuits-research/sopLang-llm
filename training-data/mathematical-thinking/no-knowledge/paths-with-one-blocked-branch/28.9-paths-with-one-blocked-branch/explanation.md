# Explanation 28.9 — Paths with one blocked branch

## Explanation

1. Blocking one end of the graph does not make the cases equal, so the paths through each first step are counted separately.
2. Through A there are 3 continuations, and through B there are 2.
3. Adding the disjoint groups of paths gives 5 complete paths.

Reference solution as printed in the source (chapter 28, 4 steps):

1. Split by the first choice.
2. Through A there are 3 continuations.
3. Through B there are 2 continuations.
4. The cases do not overlap, so 3+2=5.

## Result

**Answer.** 5 paths.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
