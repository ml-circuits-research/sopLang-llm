# Explanation 7.1.10 — Units and rates

## Explanation

1. The overhead removes 5% of the throughput, so the useful rate is 18 × (1 − 5/100) = 17.1 service units/hour.
2. The running time is 110 minutes, that is 110/60 = 1.83 hours.
3. The produced quantity is the useful rate times the running time, 17.1 service units/hour × 110/60 hours = 31.35 service units.
4. The per-hour unit of the rate cancels against the hours of the running time, so the result is a quantity, not a rate.

Reference solution as printed in the source (template 2, 3 steps):

1. Useful rate = 18 × (1 − 5/100) = 17.1 service units/hour.
2. 110 minutes = 110/60 = 1.83 hours.
3. Quantity = rate × time = 17.1 service units/hour × 1.83 hours = 31.35 service units; the hour units cancel.

## Result

**Answer.** 31.35 useful service units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
