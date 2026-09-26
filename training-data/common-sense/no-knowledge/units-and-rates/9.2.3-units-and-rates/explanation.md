# Explanation 9.2.3 — Units and rates

## Explanation

1. The overhead removes 0% of the throughput, so the useful rate is 48 × (1 − 0/100) = 48 uses/hour.
2. The running time is 45 minutes, that is 45/60 = 0.75 hours.
3. The produced quantity is the useful rate times the running time, 48 uses/hour × 45/60 hours = 36 uses.
4. The per-hour unit of the rate cancels against the hours of the running time, so the result is a quantity, not a rate.

Reference solution as printed in the source (template 2, 3 steps):

1. Useful rate = 48 × (1 − 0/100) = 48 uses/hour.
2. 45 minutes = 45/60 = 0.75 hours.
3. Quantity = rate × time = 48 uses/hour × 0.75 hours = 36 uses; the hour units cancel.

## Result

**Answer.** 36 useful uses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
