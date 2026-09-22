# Explanation depletion-days-and-lead-time-23 — Depletion Days and Lead Time

## Explanation

1. The workshop consumes 12 units a day from 70 units of pipe.
2. The stock covers 5 whole days, and the remainder cannot pay for another day.
3. A delivery takes 5 days, so ordering today is required.

**Generator provenance.** arithmetic.mjs 1.2.0, family depletion-days-and-lead-time, instance 23, sampled with seed 20260921 from the latent plan `depletion-days-and-lead-time`; this example carries no source span because its statement was generated.

## Result

**Answer.** The stock covers 5 whole days, so the order must be placed today.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
