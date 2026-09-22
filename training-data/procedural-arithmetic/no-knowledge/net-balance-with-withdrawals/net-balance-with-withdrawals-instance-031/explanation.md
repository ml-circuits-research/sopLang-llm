# Explanation net-balance-with-withdrawals-31 — Net Balance with Withdrawals

## Explanation

1. The account opens with 122 units.
2. Deposits add 17 + 17 + 10 units and withdrawals remove 45 + 22 units plus 6 units of fee each.
3. Summing the ledger gives a closing balance of 87 units after 2 withdrawals.

**Generator provenance.** arithmetic.mjs 1.3.0, family net-balance-with-withdrawals, instance 31, sampled with seed 20260921 from the latent plan `net-balance-with-withdrawals`; this example carries no source span because its statement was generated.

## Result

**Answer.** The closing balance is 87 units after 2 withdrawals.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
