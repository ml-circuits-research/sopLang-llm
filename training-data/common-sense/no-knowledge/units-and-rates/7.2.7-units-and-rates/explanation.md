# Explanation 7.2.7 — Units and rates

## Explanation

1. The overhead removes 12% of the throughput, so the useful rate is 36 × (1 − 12/100) = 31.68 service units/hour.
2. The running time is 90 minutes, that is 90/60 = 1.5 hours.
3. The produced quantity is the useful rate times the running time, 31.68 service units/hour × 90/60 hours = 47.52 service units.
4. The per-hour unit of the rate cancels against the hours of the running time, so the result is a quantity, not a rate.

Reference solution as printed in the source (template 2, 3 steps):

1. Useful rate = 36 × (1 − 12/100) = 31.68 service units/hour.
2. 90 minutes = 90/60 = 1.5 hours.
3. Quantity = rate × time = 31.68 service units/hour × 1.5 hours = 47.52 service units; the hour units cancel.

## Result

**Answer.** 47.52 useful service units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
