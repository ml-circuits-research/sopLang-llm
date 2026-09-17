# Explanation 24.16 — Remaining capacity

## Explanation

1. The capacity is a limit: the bottle holds at most 750 ml in total, and the liquid already inside fills 500 ml of it.
2. The free space is the difference 750 - 500 = 250 ml, exactly what can be added without exceeding the limit.

Reference solution as printed in the source (chapter 24, 4 steps):

1. The maximum capacity is 750 ml.
2. The current amount occupies 500 ml.
3. The difference is 250 ml.
4. Adding exactly 250 ml reaches the limit without exceeding it.

## Result

**Answer.** 250 ml.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
