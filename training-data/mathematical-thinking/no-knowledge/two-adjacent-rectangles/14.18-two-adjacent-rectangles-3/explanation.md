# Explanation 14.18 — Two Adjacent Rectangles 3

## Explanation

1. The statement gives the additive rule: the area of a composite figure built from non-overlapping parts is the sum of the areas of those parts.
2. Each part is a rectangle of height 5, so the first covers 5×8 and the second 5×2 square units.
3. Summing the two products gives 50, and the shared height means the same total is 5×(8+2).

Reference solution as printed in the source (chapter 14, 4 steps):

1. First rectangle: 5×8=40.
2. Second rectangle: 5×2=10.
3. Sum: 40+10=50.
4. Observation: this is the same result as 5×(8+2)=50.

## Result

**Answer.** 50

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
