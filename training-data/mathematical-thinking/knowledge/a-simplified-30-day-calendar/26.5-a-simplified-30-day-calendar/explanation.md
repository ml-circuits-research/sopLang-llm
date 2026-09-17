# Explanation 26.5 — A simplified 30-day calendar

## Explanation

1. Dates are counted from 1, so from day 1 to day 10 the calendar advances 9 day steps.
2. Reducing those 9 steps modulo the seven weekdays leaves the displacement that actually moves the weekday.
3. Starting from Monday in the order read from the fact table, the resulting weekday is Wednesday; the 30-day length only bounds the date.

Reference solution as printed in the source (chapter 26, 4 steps):

1. Day 8 is Monday again, 7 days after day 1.
2. Day 9 is Tuesday.
3. Day 10 is Wednesday.
4. We used the 7-day cycle.

## Result

**Answer.** Wednesday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
