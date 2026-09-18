# Explanation 647 — Rates and accumulation

## Explanation

1. A rate is a change per interval, so the constant net change of +2 energy units per interval is added once for every interval.
2. After 4 intervals the value is 4+4×2=12 energy units; two more intervals add 2×2.
3. The value after two more intervals is therefore 16 energy units, not 12×2, because accumulation repeats the change instead of multiplying the total.

Reference solution as printed in the source (form 27, 4 steps):

1. The constant rate is +2 per interval.
2. The sequence is: 4 → 6 → 8 → 10 → 12.
3. after 4 intervals we have 12; still two adds 4.
4. A rate is a change per interval; accumulation repeats the same change.

## Result

**Answer.** after 4 intervals: 12 energy units; after two more: 16 energy units

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
