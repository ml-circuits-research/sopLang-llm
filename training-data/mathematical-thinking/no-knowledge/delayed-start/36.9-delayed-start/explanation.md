# Explanation 36.9 — Delayed start

## Explanation

1. While B travels alone for 2 hours at 3 km/h, it builds a lead of 6 km.
2. Once both move, only the speed difference closes that lead, at 5 - 3 = 2 km/h.
3. The lead divided by that rate gives 3 hours of chasing.

Reference solution as printed in the source (chapter 36, 4 steps):

1. In 2 hours, B travels 6 km.
2. After A starts, B continues at 3 and A at 5.
3. A gains 2 km per hour.
4. 6÷2=3 hours after A starts.

## Result

**Answer.** 6 km head start; A catches B in 3 hours.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
