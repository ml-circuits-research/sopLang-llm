# Explanation 6.10.5 — Units and rates

## Explanation

1. The overhead removes 10% of the throughput, so the useful rate is 18 × (1 − 10/100) = 16.2 residents/hour.
2. The running time is 75 minutes, that is 75/60 = 1.25 hours.
3. The produced quantity is the useful rate times the running time, 16.2 residents/hour × 75/60 hours = 20.25 residents.
4. The per-hour unit of the rate cancels against the hours of the running time, so the result is a quantity, not a rate.

Reference solution as printed in the source (template 2, 3 steps):

1. Useful rate = 18 × (1 − 10/100) = 16.2 residents/hour.
2. 75 minutes = 75/60 = 1.25 hours.
3. Quantity = rate × time = 16.2 residents/hour × 1.25 hours = 20.25 residents; the hour units cancel.

## Result

**Answer.** 20.25 useful residents.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
