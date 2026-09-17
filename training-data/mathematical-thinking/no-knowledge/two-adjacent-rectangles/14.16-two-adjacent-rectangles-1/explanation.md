# Explanation 14.16 — Two Adjacent Rectangles 1

## Explanation

1. The statement gives the additive rule: the area of a composite figure built from non-overlapping parts is the sum of the areas of those parts.
2. Each part is a rectangle of height 4, so the first covers 4×5 and the second 4×3 square units.
3. Summing the two products gives 32, and the shared height means the same total is 4×(5+3).

Reference solution as printed in the source (chapter 14, 4 steps):

1. First rectangle: 4×5=20.
2. Second rectangle: 4×3=12.
3. Sum: 20+12=32.
4. Observation: this is the same result as 4×(5+3)=32.

## Result

**Answer.** 32

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
