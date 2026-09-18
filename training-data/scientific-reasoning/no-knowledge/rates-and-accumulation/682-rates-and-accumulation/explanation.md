# Explanation 682 — Rates and accumulation

## Explanation

1. The whole increase is 30-5=25 mass units, and the model spreads it over 5 equal intervals, so the net change is 25÷5=+5 mass units per interval.
2. The first interval adds that change once: 5+5=10 mass units.
3. One interval beyond the final measurement adds the same change to the measured value, 30+5=35 mass units.
4. The check is the accumulation rule itself: start + number of intervals × rate reproduces every stated value.

Reference solution as printed in the source (form 27, 4 steps):

1. The total increase is 30-5=25.
2. We divide by 5 intervals: the rate is 5 mass units per interval.
3. after the first interval: 10; after one additional interval beyond the final observed value: 35.
4. We check by recomputing the accumulation: start + number_of_intervals × rate.

## Result

**Answer.** The rate is +5 mass units/interval; after first interval 10, and after one additional interval 35.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
