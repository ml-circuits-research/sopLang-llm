# Explanation 14.20 — Two Adjacent Rectangles 5

## Explanation

1. The statement gives the additive rule: the area of a composite figure built from non-overlapping parts is the sum of the areas of those parts.
2. Each part is a rectangle of height 8, so the first covers 8×5 and the second 8×4 square units.
3. Summing the two products gives 72, and the shared height means the same total is 8×(5+4).

Reference solution as printed in the source (chapter 14, 4 steps):

1. First rectangle: 8×5=40.
2. Second rectangle: 8×4=32.
3. Sum: 40+32=72.
4. Observation: this is the same result as 8×(5+4)=72.

## Result

**Answer.** 72

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
