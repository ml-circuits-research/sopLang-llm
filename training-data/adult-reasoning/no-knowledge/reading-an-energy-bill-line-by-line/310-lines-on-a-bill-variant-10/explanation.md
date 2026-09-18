# Explanation 310 — Lines on a bill — variant 10

## Explanation

1. The bill for Cara in Station Quarter charges 188 kWh at 0.79 per kWh, which the index moving from 10230 to 10418 confirms.
2. Energy 148.52 plus the standing charge 17.00 plus the levy 4.50 gives the on-time total 170.02.
3. Paying on the 28th is 3 days after the 25th, so the penalty is 3 days at 0.02% of the total, that is 0.1020.
4. The standing charge covers 30 days, so it is a monthly amount and not the daily amount of 17.00 the payer assumes.

Reference material as printed in the source:

Index check: the difference is 188. The unit beside the number decides everything. 0.02% = 0.0002.

## Result

**Answer.** Total 170.02. Penalty 0.1020. The standing charge is monthly, not daily.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
