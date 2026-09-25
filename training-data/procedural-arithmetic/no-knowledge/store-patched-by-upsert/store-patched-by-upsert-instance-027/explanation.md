# Explanation store-patched-by-upsert-27 — Store Patched By Upsert

## Explanation

1. The store starts with 4 shipments and replaces the shipment B with a quantity of 28.
2. Replacing a keyed record keeps the count at 4 shipments.
3. The patched view totals 62 units.

**Generator provenance.** arithmetic.mjs 1.3.0, family store-patched-by-upsert, instance 27, sampled with seed 20260921 from the latent plan `store-patched-by-upsert`; this example carries no source span because its statement was generated.

## Result

**Answer.** The store holds 4 shipments whose total quantity is 62 units.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
