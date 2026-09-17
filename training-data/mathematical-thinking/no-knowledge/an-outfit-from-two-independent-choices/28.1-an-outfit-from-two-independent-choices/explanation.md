# Explanation 28.1 — An outfit from two independent choices

## Explanation

1. An outfit pairs one shirt with one pair of trousers, and the two choices are independent.
2. There are 2 shirts and 3 pairs of trousers, so the outfits are counted by the product.
3. The product is 6, which is the number of different outfits.

Reference solution as printed in the source (chapter 28, 4 steps):

1. With the red shirt there are 3 trouser choices.
2. With the blue shirt there are another 3.
3. The two groups of outfits do not overlap.
4. 3+3=6.

## Result

**Answer.** 6 outfits.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
