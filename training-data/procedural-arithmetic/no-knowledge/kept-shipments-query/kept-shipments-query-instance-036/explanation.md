# Explanation kept-shipments-query-36 — Kept Shipments Query

## Explanation

1. The store records 5 shipments and keeps only those with a quantity of at least 28.
2. That filter keeps 3 shipments.
3. The kept shipments total 103 units.

**Generator provenance.** arithmetic.mjs 1.3.0, family kept-shipments-query, instance 36, sampled with seed 20260921 from the latent plan `kept-shipments-query`; this example carries no source span because its statement was generated.

## Result

**Answer.** 3 shipments were kept, and their total quantity is 103 units.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
