# Explanation 3.5.6 — Units and rates

## Explanation

1. The overhead removes 12% of the throughput, so the useful rate is 18 × (1 − 12/100) = 15.84 participants/hour.
2. The running time is 45 minutes, that is 45/60 = 0.75 hours.
3. The produced quantity is the useful rate times the running time, 15.84 participants/hour × 45/60 hours = 11.88 participants.
4. The per-hour unit of the rate cancels against the hours of the running time, so the result is a quantity, not a rate.

Reference solution as printed in the source (template 2, 3 steps):

1. Useful rate = 18 × (1 − 12/100) = 15.84 participants/hour.
2. 45 minutes = 45/60 = 0.75 hours.
3. Quantity = rate × time = 15.84 participants/hour × 0.75 hours = 11.88 participants; the hour units cancel.

## Result

**Answer.** 11.88 useful participants.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
