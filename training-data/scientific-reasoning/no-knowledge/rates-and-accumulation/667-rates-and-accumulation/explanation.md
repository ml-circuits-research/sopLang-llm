# Explanation 667 — Rates and accumulation

## Explanation

1. A rate is a change per interval, so the constant net change of +2 u.a. per interval is added once for every interval.
2. After 5 intervals the value is 5+5×2=15 u.a.; two more intervals add 2×2.
3. The value after two more intervals is therefore 19 u.a., not 15×2, because accumulation repeats the change instead of multiplying the total.

Reference solution as printed in the source (form 27, 4 steps):

1. The constant rate is +2 per interval.
2. The sequence is: 5 → 7 → 9 → 11 → 13 → 15.
3. after 5 intervals we have 15; still two adds 4.
4. A rate is a change per interval; accumulation repeats the same change.

## Result

**Answer.** after 5 intervals: 15 u.a.; after two more: 19 u.a.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
