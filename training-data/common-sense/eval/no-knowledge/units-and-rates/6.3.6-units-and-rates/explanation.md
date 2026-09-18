# Explanation 6.3.6 — Units and rates

## Explanation

1. The overhead removes 0% of the throughput, so the useful rate is 18 × (1 − 0/100) = 18 residents/hour.
2. The running time is 50 minutes, that is 50/60 = 0.83 hours.
3. The produced quantity is the useful rate times the running time, 18 residents/hour × 50/60 hours = 15 residents.
4. The per-hour unit of the rate cancels against the hours of the running time, so the result is a quantity, not a rate.

Reference solution as printed in the source (template 2, 3 steps):

1. Useful rate = 18 × (1 − 0/100) = 18 residents/hour.
2. 50 minutes = 50/60 = 0.83 hours.
3. Quantity = rate × time = 18 residents/hour × 0.83 hours = 15 residents; the hour units cancel.

## Result

**Answer.** 15 useful residents.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
