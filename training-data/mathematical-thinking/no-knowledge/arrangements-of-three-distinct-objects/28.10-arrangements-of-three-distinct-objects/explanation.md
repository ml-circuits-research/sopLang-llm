# Explanation 28.10 — Arrangements of three distinct objects

## Explanation

1. All 3 books are distinct, so an order is a permutation of the whole set.
2. The first position takes any book, and each later position loses one available book.
3. Multiplying 3 × 2 × … × 1 gives 6 orders.

Reference solution as printed in the source (chapter 28, 4 steps):

1. For the first position there are 3 choices.
2. For the second, 2 remain.
3. The last book is forced.
4. 3×2×1=6.

## Result

**Answer.** 6 orders.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
