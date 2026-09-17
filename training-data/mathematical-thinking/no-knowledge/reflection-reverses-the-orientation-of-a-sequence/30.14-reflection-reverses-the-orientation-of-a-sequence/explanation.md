# Explanation 30.14 — Reflection reverses the orientation of a sequence

## Explanation

1. The printed order from left to right is A-B-C.
2. A vertical reflection swaps left and right, so the leftmost item becomes the rightmost and the order is reversed.
3. The image shows C-B-A.

Reference solution as printed in the source (chapter 30, 4 steps):

1. A, originally on the left, moves to the right.
2. C moves to the left.
3. B, in the middle, stays in the middle if the axis passes through it.
4. The order is C-B-A.

## Result

**Answer.** C-B-A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
