# Explanation 49 — Nested places: Iris, Northland, and Republic B

## Explanation

1. Read the direct container of Iris first.
2. Then propagate upward through the stated chain, which adds Republic B, Aurora.
3. Transitivity makes every unit on that chain a container of Iris, in that order.

Reference solution as printed in the source (family G10, 2 steps):

1. Read the direct container: Northland.
2. Propagate upward to Republic B and Aurora.

## Result

**Answer.** Northland, Republic B, and Aurora.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
