# Explanation cheaper-rate-per-unit-40 — Cheaper Rate per Unit

## Explanation

1. Dragomir charges 23 units for 17 metres, and Dragomir charges 106 units for 16 metres.
2. The comparison crosses the quantities instead of rounding the two rates, so the verdict never depends on a rounded middle value.
3. Dragomir is the cheaper offer, by 5.27 units per metre.

**Generator provenance.** arithmetic.mjs 1.2.0, family cheaper-rate-per-unit, instance 40, sampled with seed 20260921 from the latent plan `cheaper-rate-per-unit`; this example carries no source span because its statement was generated.

## Result

**Answer.** Dragomir is cheaper per metre by 5.27 units per metre.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
