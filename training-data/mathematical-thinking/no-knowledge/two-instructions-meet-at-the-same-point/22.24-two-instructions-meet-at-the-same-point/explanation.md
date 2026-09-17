# Explanation 22.24 — Two instructions meet at the same point

## Explanation

1. Each offset updates one coordinate: north and south change the first coordinate, east and west change the second.
2. From A=(2,2) a 3-square move east gives B, and from B a 3-square move north gives D.
3. Comparing the result with the explicitly given C shows whether the two descriptions name the same point.

Reference solution as printed in the source (chapter 22, 4 steps):

1. Moving 3 east from A=(2,2) gives B=(2,5).
2. Moving 3 north from B increases the first coordinate from 2 to 5.
3. Therefore D=(5,5).
4. Since C is also (5,5), the two points coincide.

## Result

**Answer.** Yes; C=D=(5,5).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
