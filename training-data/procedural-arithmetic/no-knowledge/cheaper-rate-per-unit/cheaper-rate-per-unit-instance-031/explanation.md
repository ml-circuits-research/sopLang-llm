# Explanation cheaper-rate-per-unit-31 — Cheaper Rate per Unit

## Explanation

1. Costache charges 60 units for 8 metres, and Dragomir charges 94 units for 11 metres.
2. The comparison crosses the quantities instead of rounding the two rates, so the verdict never depends on a rounded middle value.
3. Costache is the cheaper offer, by 1.05 units per metre.

**Generator provenance.** arithmetic.mjs 1.1.0, family cheaper-rate-per-unit, instance 31, sampled with seed 20260921 from the latent plan `cheaper-rate-per-unit`; this example carries no source span because its statement was generated.

## Result

**Answer.** Costache is cheaper per metre by 1.05 units per metre.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
