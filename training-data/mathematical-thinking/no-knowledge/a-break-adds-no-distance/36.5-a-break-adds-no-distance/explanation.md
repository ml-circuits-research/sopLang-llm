# Explanation 36.5 — A break adds no distance

## Explanation

1. Standing still covers no distance, so the break contributes 0 km but still counts on the clock.
2. The two walking stretches give 2 × 4 and 1 × 4 km.
3. The distance is 12 km, while the clock time adds the break: 2 + 1 + 1 = 4 hours.

Reference solution as printed in the source (chapter 36, 4 steps):

1. In the first 2 hours, the person travels 8 km.
2. During the break, 0 km are traveled.
3. In the last hour, 4 km are traveled.
4. Total 12 km; elapsed time from departure to arrival is 2+1+1=4 hours.

## Result

**Answer.** 12 km and 4 hours.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
