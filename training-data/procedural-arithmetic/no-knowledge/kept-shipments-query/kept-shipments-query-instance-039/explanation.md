# Explanation kept-shipments-query-39 — Kept Shipments Query

## Explanation

1. The store records 4 shipments and keeps only those with a quantity of at least 8.
2. That filter keeps 4 shipments.
3. The kept shipments total 100 units.

**Generator provenance.** arithmetic.mjs 1.3.0, family kept-shipments-query, instance 39, sampled with seed 20260921 from the latent plan `kept-shipments-query`; this example carries no source span because its statement was generated.

## Result

**Answer.** 4 shipments were kept, and their total quantity is 100 units.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
