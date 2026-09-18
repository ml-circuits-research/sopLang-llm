# Explanation 662 — Rates and accumulation

## Explanation

1. The whole increase is 24-4=20 energy units, and the model spreads it over 4 equal intervals, so the net change is 20÷4=+5 energy units per interval.
2. The first interval adds that change once: 4+5=9 energy units.
3. One interval beyond the final measurement adds the same change to the measured value, 24+5=29 energy units.
4. The check is the accumulation rule itself: start + number of intervals × rate reproduces every stated value.

Reference solution as printed in the source (form 27, 4 steps):

1. The total increase is 24-4=20.
2. We divide by 4 intervals: the rate is 5 energy units per interval.
3. after the first interval: 9; after one additional interval beyond the final observed value: 29.
4. We check by recomputing the accumulation: start + number_of_intervals × rate.

## Result

**Answer.** The rate is +5 energy units/interval; after first interval 9, and after one additional interval 29.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
