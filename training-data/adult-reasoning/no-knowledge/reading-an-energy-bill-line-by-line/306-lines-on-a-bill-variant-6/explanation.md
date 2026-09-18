# Explanation 306 — Lines on a bill — variant 6

## Explanation

1. The bill for Gina in Stadium District charges 140 kWh at 0.75 per kWh, which the index moving from 10230 to 10370 confirms.
2. Energy 105.00 plus the standing charge 13.00 plus the levy 4.50 gives the on-time total 122.50.
3. Paying on the 28th is 3 days after the 25th, so the penalty is 3 days at 0.02% of the total, that is 0.0735.
4. The standing charge covers 30 days, so it is a monthly amount and not the daily amount of 13.00 the payer assumes.

Reference material as printed in the source:

Index check: the difference is 140. The unit beside the number decides everything. 0.02% = 0.0002.

## Result

**Answer.** Total 122.50. Penalty 0.0735. The standing charge is monthly, not daily.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
