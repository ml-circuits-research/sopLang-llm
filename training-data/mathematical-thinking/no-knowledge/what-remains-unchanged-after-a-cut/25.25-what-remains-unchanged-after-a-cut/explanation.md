# Explanation 25.25 — What remains unchanged after a cut?

## Explanation

1. A single cut separates the sheet into two parts, so the number of pieces changes from one to 2.
2. Nothing is thrown away, so every bit of paper is still present in one of the pieces.
3. The total amount of paper is therefore unchanged, while the count of separate pieces is not.

Reference solution as printed in the source (chapter 25, 4 steps):

1. Before cutting, there is one piece.
2. After cutting, there are two pieces.
3. No material is removed according to the problem.
4. Therefore the number of pieces increases, while the total amount of paper stays the same.

## Result

**Answer.** The number of pieces changes; the total amount remains the same.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
