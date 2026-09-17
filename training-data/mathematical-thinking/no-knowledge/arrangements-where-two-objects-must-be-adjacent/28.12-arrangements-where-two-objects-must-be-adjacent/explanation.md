# Explanation 28.12 — Arrangements where two objects must be adjacent

## Explanation

1. The requirement only concerns A and B, so the other arrangements are the permutations that keep those two next to each other.
2. Checking every order of the objects and keeping the ones where the two positions differ by one is a direct count.
3. Out of all orders, 4 place A and B side by side.

Reference solution as printed in the source (chapter 28, 4 steps):

1. List the 6 possible orders.
2. In ACB, A and B are separated by C, so it is not allowed.
3. In BCA, B and A are separated, so it is not allowed.
4. The other four have A and B adjacent.

## Result

**Answer.** 4 orders.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
