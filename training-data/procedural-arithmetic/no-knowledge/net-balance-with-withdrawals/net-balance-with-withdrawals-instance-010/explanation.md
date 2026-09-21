# Explanation net-balance-with-withdrawals-10 — Net Balance with Withdrawals

## Explanation

1. The account opens with 125 units.
2. Deposits add 88 + 50 + 67 units and withdrawals remove 30 + 16 units plus 4 units of fee each.
3. Summing the ledger gives a closing balance of 276 units after 2 withdrawals.

**Generator provenance.** arithmetic.mjs 1.0.0, family net-balance-with-withdrawals, instance 10, sampled with seed 20260921 from the latent plan `net-balance-with-withdrawals`; this example carries no source span because its statement was generated.

## Result

**Answer.** The closing balance is 276 units after 2 withdrawals.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
