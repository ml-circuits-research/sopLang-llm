# Explanation 33.25 — Compare two algorithms by number of steps

## Explanation

1. Algorithm L visits the list in order, so the target 8 is found only after all preceding elements are compared: 8 comparisons.
2. Algorithm H uses the sorted order: it tests the middle, then keeps the half that can still contain the target.
3. Halving the candidates reaches 8 in 4 comparisons, which is fewer than the linear scan.

Reference solution as printed in the source (chapter 33, 4 steps):

1. L tests every value from 1 through 8 until the target: 8 comparisons.
2. H has the given sequence of four checks.
3. Both find 8.
4. H uses half as many comparisons in this case.

## Result

**Answer.** L: 8; H: 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
