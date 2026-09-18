# Explanation 883 — Locating a point by constraints: case 3

## Explanation

1. P must be a whole-number grid point between 0 and 8 in both coordinates, and every stated constraint has to hold at the same time.
2. Testing the grid points against the 3 stated constraints leaves a single point: (6, 8).
3. Only one grid point satisfies all the clues together, so the location is uniquely determined.

Reference solution as printed in the source (family N2, 3 steps):

1. List pairs satisfying x+y=14.
2. Keep only those also satisfying x−y=-2.
3. The remaining set is [(6, 8)].

## Result

**Answer.** P=(6, 8); the solution is unique.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
