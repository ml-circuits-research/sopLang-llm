# Explanation 712 — Rates and accumulation

## Explanation

1. The whole increase is 20-5=15 load units, and the model spreads it over 5 equal intervals, so the net change is 15÷5=+3 load units per interval.
2. The first interval adds that change once: 5+3=8 load units.
3. One interval beyond the final measurement adds the same change to the measured value, 20+3=23 load units.
4. The check is the accumulation rule itself: start + number of intervals × rate reproduces every stated value.

Reference solution as printed in the source (form 27, 4 steps):

1. The total increase is 20-5=15.
2. We divide by 5 intervals: the rate is 3 load units per interval.
3. after the first interval: 8; after one additional interval beyond the final observed value: 23.
4. We check by recomputing the accumulation: start + number_of_intervals × rate.

## Result

**Answer.** The rate is +3 load units/interval; after first interval 8, and after one additional interval 23.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
