# Explanation 34.25 — Optimization with equal groups

## Explanation

1. Equal boxes mean one number x repeated 3 times, so 3x = 12.
2. Dividing gives x = 4, which is a whole number and therefore usable in every box.
3. Any other whole number would not add back to 12, so the equal-split solution is unique.

Reference solution as printed in the source (chapter 34, 4 steps):

1. Equality requires the same value x in each box.
2. The total is x+x+x=3x.
3. 3x=12 gives x=4.
4. Any other value would change the total.

## Result

**Answer.** 4 in each.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
