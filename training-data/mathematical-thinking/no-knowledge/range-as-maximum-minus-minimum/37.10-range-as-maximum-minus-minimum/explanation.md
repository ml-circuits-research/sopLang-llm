# Explanation 37.10 — Range as maximum minus minimum

## Explanation

1. The statement defines the range as the maximum value minus the minimum value.
2. The largest value is 11 and the smallest is 3, so the range is 8.

Reference solution as printed in the source (chapter 37, 4 steps):

1. The minimum is 3.
2. The maximum is 11.
3. Subtract: 11-3=8.
4. Intermediate values do not change the range.

## Result

**Answer.** 8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
