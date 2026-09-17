# Explanation 27.12 — Increase from one day to the next

## Explanation

1. A change from one day to the next is the later count minus the earlier one: 11 minus 8.
2. The result 3 is positive, which is why the problem calls it an increase.

Reference solution as printed in the source (chapter 27, 4 steps):

1. The new value is 11.
2. The old value is 8.
3. The difference 11−8=3 is positive.
4. Therefore the increase is 3.

## Result

**Answer.** By 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
