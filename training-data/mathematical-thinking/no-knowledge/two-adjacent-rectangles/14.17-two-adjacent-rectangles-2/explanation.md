# Explanation 14.17 — Two Adjacent Rectangles 2

## Explanation

1. The statement gives the additive rule: the area of a composite figure built from non-overlapping parts is the sum of the areas of those parts.
2. Each part is a rectangle of height 6, so the first covers 6×4 and the second 6×7 square units.
3. Summing the two products gives 66, and the shared height means the same total is 6×(4+7).

Reference solution as printed in the source (chapter 14, 4 steps):

1. First rectangle: 6×4=24.
2. Second rectangle: 6×7=42.
3. Sum: 24+42=66.
4. Observation: this is the same result as 6×(4+7)=66.

## Result

**Answer.** 66

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
