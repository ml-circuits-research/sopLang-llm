# Explanation 28.11 — Arrangements with one book fixed

## Explanation

1. A is fixed in the first position, so only the other books can move.
2. The remaining 3 books permute freely among the remaining positions.
3. That gives 6 orders, the same as permuting 3 books.

Reference solution as printed in the source (chapter 28, 4 steps):

1. The first position is no longer a choice: A is fixed.
2. There are 3 books left for the second position.
3. Then 2, then 1.
4. 3×2×1=6.

## Result

**Answer.** 6 orders.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
