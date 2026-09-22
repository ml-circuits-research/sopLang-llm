# Explanation depletion-days-and-lead-time-15 — Depletion Days and Lead Time

## Explanation

1. The workshop consumes 4 units a day from 32 units of pipe.
2. The stock covers 8 whole days, and the remainder cannot pay for another day.
3. A delivery takes 5 days, so ordering today is not required yet.

**Generator provenance.** arithmetic.mjs 1.2.0, family depletion-days-and-lead-time, instance 15, sampled with seed 20260921 from the latent plan `depletion-days-and-lead-time`; this example carries no source span because its statement was generated.

## Result

**Answer.** The stock covers 8 whole days, so the order can wait.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
