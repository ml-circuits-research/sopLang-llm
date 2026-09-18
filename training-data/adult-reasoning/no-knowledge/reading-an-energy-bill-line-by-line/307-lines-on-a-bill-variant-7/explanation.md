# Explanation 307 — Lines on a bill — variant 7

## Explanation

1. The bill for Kara in Maple Ward charges 152 kWh at 0.76 per kWh, which the index moving from 10230 to 10382 confirms.
2. Energy 115.52 plus the standing charge 14.00 plus the levy 4.50 gives the on-time total 134.02.
3. Paying on the 28th is 3 days after the 25th, so the penalty is 3 days at 0.02% of the total, that is 0.0804.
4. The standing charge covers 30 days, so it is a monthly amount and not the daily amount of 14.00 the payer assumes.

Reference material as printed in the source:

Index check: the difference is 152. The unit beside the number decides everything. 0.02% = 0.0002.

## Result

**Answer.** Total 134.02. Penalty 0.0804. The standing charge is monthly, not daily.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
