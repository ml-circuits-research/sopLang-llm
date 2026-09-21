# Explanation net-balance-with-withdrawals-5 — Net Balance with Withdrawals

## Explanation

1. The account opens with 62 units.
2. Deposits add 54 + 16 + 14 units and withdrawals remove 38 + 22 units plus 5 units of fee each.
3. Summing the ledger gives a closing balance of 76 units after 2 withdrawals.

**Generator provenance.** arithmetic.mjs 1.0.0, family net-balance-with-withdrawals, instance 5, sampled with seed 20260921 from the latent plan `net-balance-with-withdrawals`; this example carries no source span because its statement was generated.

## Result

**Answer.** The closing balance is 76 units after 2 withdrawals.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
