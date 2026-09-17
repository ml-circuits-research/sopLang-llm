# Explanation 28.18 — Possible sums, not possible outcomes

## Explanation

1. Adding the faces of the 2 cubes gives a sum for every ordered pair, but different pairs may share one sum.
2. Collecting the sums of all outcomes and keeping each value once is the relevant count here.
3. The ruled-out outcomes disappear, and the possible sums are 2, 3, and 4.

Reference solution as printed in the source (chapter 28, 4 steps):

1. List the 4 pairs.
2. (1,1) gives 2.
3. (1,2) and (2,1) both give 3; (2,2) gives 4.
4. The distinct sum values are only 2,3,4.

## Result

**Answer.** 2, 3, and 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
