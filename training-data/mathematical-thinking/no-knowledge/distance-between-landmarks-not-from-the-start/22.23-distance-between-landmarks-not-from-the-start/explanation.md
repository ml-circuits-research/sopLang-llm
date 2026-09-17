# Explanation 22.23 — Distance between landmarks, not from the start

## Explanation

1. Both positions are measured in the same unit from the same origin, so the distance between the landmarks is the absolute difference of the two numbers.
2. The difference between 4 and 11 is 7 units.

Reference solution as printed in the source (chapter 22, 4 steps):

1. Both positions use the same origin and unit.
2. The separation is the absolute difference of the positions.
3. 11−4=7.
4. Thus the landmarks are 7 units apart.

## Result

**Answer.** 7 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
