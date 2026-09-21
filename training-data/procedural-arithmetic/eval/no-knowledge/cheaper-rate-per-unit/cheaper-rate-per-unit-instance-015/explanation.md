# Explanation cheaper-rate-per-unit-15 — Cheaper Rate per Unit

## Explanation

1. Costache charges 41 units for 6 metres, and Farkas charges 68 units for 10 metres.
2. The comparison crosses the quantities instead of rounding the two rates, so the verdict never depends on a rounded middle value.
3. Farkas is the cheaper offer, by 0.03 units per metre.

**Generator provenance.** arithmetic.mjs 1.0.0, family cheaper-rate-per-unit, instance 15, sampled with seed 20260921 from the latent plan `cheaper-rate-per-unit`; this example carries no source span because its statement was generated.

## Result

**Answer.** Farkas is cheaper per metre by 0.03 units per metre.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
