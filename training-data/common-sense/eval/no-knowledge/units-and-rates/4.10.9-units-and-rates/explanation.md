# Explanation 4.10.9 — Units and rates

## Explanation

1. The overhead removes 10% of the throughput, so the useful rate is 30 × (1 − 10/100) = 27 measurements/hour.
2. The running time is 35 minutes, that is 35/60 = 0.58 hours.
3. The produced quantity is the useful rate times the running time, 27 measurements/hour × 35/60 hours = 15.75 measurements.
4. The per-hour unit of the rate cancels against the hours of the running time, so the result is a quantity, not a rate.

Reference solution as printed in the source (template 2, 3 steps):

1. Useful rate = 30 × (1 − 10/100) = 27 measurements/hour.
2. 35 minutes = 35/60 = 0.58 hours.
3. Quantity = rate × time = 27 measurements/hour × 0.58 hours = 15.75 measurements; the hour units cancel.

## Result

**Answer.** 15.75 useful measurements.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
