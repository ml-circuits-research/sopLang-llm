# Explanation 732 — Rates and accumulation

## Explanation

1. The whole increase is 12-3=9 model L, and the model spreads it over 3 equal intervals, so the net change is 9÷3=+3 model L per interval.
2. The first interval adds that change once: 3+3=6 model L.
3. One interval beyond the final measurement adds the same change to the measured value, 12+3=15 model L.
4. The check is the accumulation rule itself: start + number of intervals × rate reproduces every stated value.

Reference solution as printed in the source (form 27, 4 steps):

1. The total increase is 12-3=9.
2. We divide by 3 intervals: the rate is 3 model L per interval.
3. after the first interval: 6; after one additional interval beyond the final observed value: 15.
4. We check by recomputing the accumulation: start + number_of_intervals × rate.

## Result

**Answer.** The rate is +3 model L/interval; after first interval 6, and after one additional interval 15.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
