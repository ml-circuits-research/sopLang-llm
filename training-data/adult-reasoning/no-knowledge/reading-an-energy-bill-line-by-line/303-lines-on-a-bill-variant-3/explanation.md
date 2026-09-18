# Explanation 303 — Lines on a bill — variant 3

## Explanation

1. The bill for Olga in Bridge City charges 104 kWh at 0.72 per kWh, which the index moving from 10230 to 10334 confirms.
2. Energy 74.88 plus the standing charge 10.00 plus the levy 4.50 gives the on-time total 89.38.
3. Paying on the 28th is 3 days after the 25th, so the penalty is 3 days at 0.02% of the total, that is 0.0536.
4. The standing charge covers 30 days, so it is a monthly amount and not the daily amount of 10.00 the payer assumes.

Reference material as printed in the source:

Index check: the difference is 104. The unit beside the number decides everything. 0.02% = 0.0002.

## Result

**Answer.** Total 89.38. Penalty 0.0536. The standing charge is monthly, not daily.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
