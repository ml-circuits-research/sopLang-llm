# Explanation 1.7.4 — Units and rates

## Explanation

1. The overhead removes 0% of the throughput, so the useful rate is 36 × (1 − 0/100) = 36 cases/hour.
2. The running time is 35 minutes, that is 35/60 = 0.58 hours.
3. The produced quantity is the useful rate times the running time, 36 cases/hour × 35/60 hours = 21 cases.
4. The per-hour unit of the rate cancels against the hours of the running time, so the result is a quantity, not a rate.

Reference solution as printed in the source (template 2, 3 steps):

1. Useful rate = 36 × (1 − 0/100) = 36 cases/hour.
2. 35 minutes = 35/60 = 0.58 hours.
3. Quantity = rate × time = 36 cases/hour × 0.58 hours = 21 cases; the hour units cancel.

## Result

**Answer.** 21 useful cases.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
