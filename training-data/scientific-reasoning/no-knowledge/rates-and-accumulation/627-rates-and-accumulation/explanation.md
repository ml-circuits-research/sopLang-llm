# Explanation 627 — Rates and accumulation

## Explanation

1. A rate is a change per interval, so the constant net change of +2 portions per interval is added once for every interval.
2. After 3 intervals the value is 3+3×2=9 portions; two more intervals add 2×2.
3. The value after two more intervals is therefore 13 portions, not 9×2, because accumulation repeats the change instead of multiplying the total.

Reference solution as printed in the source (form 27, 4 steps):

1. The constant rate is +2 per interval.
2. The sequence is: 3 → 5 → 7 → 9.
3. after 3 intervals we have 9; two more intervals add 4.
4. A rate is a change per interval; accumulation repeats the same change.

## Result

**Answer.** after 3 intervals: 9 portions; after two more: 13 portions.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
