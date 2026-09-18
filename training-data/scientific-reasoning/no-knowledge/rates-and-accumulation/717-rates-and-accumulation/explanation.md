# Explanation 717 — Rates and accumulation

## Explanation

1. A rate is a change per interval, so the constant net change of +4 J-model per interval is added once for every interval.
2. After 3 intervals the value is 3+3×4=15 J-model; two more intervals add 2×4.
3. The value after two more intervals is therefore 23 J-model, not 15×2, because accumulation repeats the change instead of multiplying the total.

Reference solution as printed in the source (form 27, 4 steps):

1. The constant rate is +4 per interval.
2. The sequence is: 3 → 7 → 11 → 15.
3. after 3 intervals we have 15; still two adds 8.
4. A rate is a change per interval; accumulation repeats the same change.

## Result

**Answer.** after 3 intervals: 15 J-model; after two more: 23 J-model.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
