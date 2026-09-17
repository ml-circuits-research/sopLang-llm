# Explanation 30.17 — Scaling defined explicitly

## Explanation

1. The problem defines scaling by factor 2 as multiplying every length by 2.
2. Applying it to the 3×5 rectangle gives 3×2 = 6 and 5×2 = 10.
3. The new dimensions are 6×10.

Reference solution as printed in the source (chapter 30, 4 steps):

1. Apply the same factor to each side.
2. 3 becomes 6.
3. 5 becomes 10.
4. The shape remains a rectangle, but its size increases.

## Result

**Answer.** 6×10.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
