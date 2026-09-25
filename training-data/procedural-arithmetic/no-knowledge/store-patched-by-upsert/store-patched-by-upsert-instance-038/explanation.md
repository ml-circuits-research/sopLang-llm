# Explanation store-patched-by-upsert-38 — Store Patched By Upsert

## Explanation

1. The store starts with 3 shipments and replaces the shipment A with a quantity of 6.
2. Replacing a keyed record keeps the count at 3 shipments.
3. The patched view totals 27 units.

**Generator provenance.** arithmetic.mjs 1.3.0, family store-patched-by-upsert, instance 38, sampled with seed 20260921 from the latent plan `store-patched-by-upsert`; this example carries no source span because its statement was generated.

## Result

**Answer.** The store holds 3 shipments whose total quantity is 27 units.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
