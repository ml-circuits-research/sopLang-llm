# Explanation 677 — Rates and accumulation

## Explanation

1. A rate is a change per interval, so the constant net change of +4 rotations per interval is added once for every interval.
2. After 4 intervals the value is 4+4×4=20 rotations; two more intervals add 2×4.
3. The value after two more intervals is therefore 28 rotations, not 20×2, because accumulation repeats the change instead of multiplying the total.

Reference solution as printed in the source (form 27, 4 steps):

1. The constant rate is +4 per interval.
2. The sequence is: 4 → 8 → 12 → 16 → 20.
3. after 4 intervals we have 20; still two adds 8.
4. A rate is a change per interval; accumulation repeats the same change.

## Result

**Answer.** after 4 intervals: 20 rotations; after two more: 28 rotations.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
