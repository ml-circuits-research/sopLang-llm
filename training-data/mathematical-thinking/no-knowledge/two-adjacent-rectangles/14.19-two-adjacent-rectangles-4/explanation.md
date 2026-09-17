# Explanation 14.19 — Two Adjacent Rectangles 4

## Explanation

1. The statement gives the additive rule: the area of a composite figure built from non-overlapping parts is the sum of the areas of those parts.
2. Each part is a rectangle of height 7, so the first covers 7×3 and the second 7×6 square units.
3. Summing the two products gives 63, and the shared height means the same total is 7×(3+6).

Reference solution as printed in the source (chapter 14, 4 steps):

1. First rectangle: 7×3=21.
2. Second rectangle: 7×6=42.
3. Sum: 21+42=63.
4. Observation: this is the same result as 7×(3+6)=63.

## Result

**Answer.** 63

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
