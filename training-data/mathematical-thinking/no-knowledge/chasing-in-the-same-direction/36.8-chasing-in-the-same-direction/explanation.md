# Explanation 36.8 — Chasing in the same direction

## Explanation

1. Moving the same way, only the difference of the speeds closes the gap: A gains 8 - 5 = 3 km each hour.
2. The initial lead of 12 km is what must be erased.
3. Dividing the lead by the catch-up rate gives 4 hours.

Reference solution as printed in the source (chapter 36, 4 steps):

1. Both move forward, so the difference in speeds matters.
2. A gains 3 km per hour.
3. 12 km must be recovered.
4. 12÷3=4 hours.

## Result

**Answer.** 4 hours.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
