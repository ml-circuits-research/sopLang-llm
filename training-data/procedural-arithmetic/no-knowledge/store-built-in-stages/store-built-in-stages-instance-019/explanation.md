# Explanation store-built-in-stages-19 — Store Built In Stages

## Explanation

1. The store seeds 3 shipments in the first stage and 3 in the second.
2. The committed store holds every seeded shipment, 6 in all.
3. Adding their quantities gives a total of 102 units.

**Generator provenance.** arithmetic.mjs 1.3.0, family store-built-in-stages, instance 19, sampled with seed 20260921 from the latent plan `store-built-in-stages`; this example carries no source span because its statement was generated.

## Result

**Answer.** The store holds 6 shipments whose total quantity is 102 units.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
