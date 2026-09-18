# Explanation 637 — Rates and accumulation

## Explanation

1. A rate is a change per interval, so the constant net change of +4 mass units per interval is added once for every interval.
2. After 5 intervals the value is 5+5×4=25 mass units; two more intervals add 2×4.
3. The value after two more intervals is therefore 33 mass units, not 25×2, because accumulation repeats the change instead of multiplying the total.

Reference solution as printed in the source (form 27, 4 steps):

1. The constant rate is +4 per interval.
2. The sequence is: 5 → 9 → 13 → 17 → 21 → 25.
3. after 5 intervals we have 25; still two adds 8.
4. A rate is a change per interval; accumulation repeats the same change.

## Result

**Answer.** after 5 intervals: 25 mass units; after two more: 33 mass units

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
