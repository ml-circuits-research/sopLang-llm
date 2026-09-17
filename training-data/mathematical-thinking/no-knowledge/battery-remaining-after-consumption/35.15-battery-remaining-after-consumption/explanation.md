# Explanation 35.15 — Battery remaining after consumption

## Explanation

1. The battery starts with 50 units.
2. In 5 hours the device consumes 6 × 5 = 30 units.
3. With no other consumption the remainder is 50 - 30 = 20 units.

Reference solution as printed in the source (chapter 35, 4 steps):

1. In 5 hours, consumption is 6×5=30.
2. Start from 50.
3. 50-30=20.
4. The value remains nonnegative, so the duration is possible.

## Result

**Answer.** 20 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
