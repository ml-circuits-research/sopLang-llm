# Explanation 21.2 — At Least One of Two Properties

## Explanation

1. Adding the two property counts counts the shared pieces twice, so the shared 3 pieces must be subtracted once.
2. The marked group is therefore 6 + 5 - 3 = 8 pieces.
3. This is the addition rule for a union of two sets.

Reference solution as printed in the source (chapter 21, 4 steps):

1. If we add 6+5, the 3 pieces with both marks are counted twice.
2. Subtract them once: 6+5-3=8.
3. The 8 pieces have a star or a stripe or both.
4. Check: 10-8=2 pieces remain with neither mark.

## Result

**Answer.** 8 pieces.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
