# Explanation 28.5 — Order matters in a race

## Explanation

1. Each result is an ordered fill of 2 places from 3 children, and one child cannot take both places.
2. The first place has every child available and the second place loses the child already placed.
3. 3 × 2 = 6 ordered results.

Reference solution as printed in the source (chapter 28, 4 steps):

1. First place has 3 possibilities.
2. Then 2 children remain for second place.
3. Order matters: A-B differs from B-A.
4. 3×2=6.

## Result

**Answer.** 6 results.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
