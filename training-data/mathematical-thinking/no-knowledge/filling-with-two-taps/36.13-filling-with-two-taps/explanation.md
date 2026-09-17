# Explanation 36.13 — Filling with two taps

## Explanation

1. Both taps feed the same tank with no losses, so their flows add to 8 + 4 = 12 L/min.
2. The volume that enters is that combined flow sustained for 10 minutes.
3. The tank receives 120 L.

Reference solution as printed in the source (chapter 36, 4 steps):

1. In one minute, 8+4=12 L enter.
2. In 10 minutes, 12×10 enter.
3. The result is 120 L.
4. The flow rates add because they act simultaneously in the same direction.

## Result

**Answer.** 120 L.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
