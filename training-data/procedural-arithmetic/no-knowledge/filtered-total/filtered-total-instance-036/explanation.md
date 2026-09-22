# Explanation filtered-total-36 — Filtered Total

## Explanation

1. The statement lists 4 values and a threshold of 12.
2. The first stage keeps the values above the threshold: 27, 30, 20.
3. The second stage totals what the first published: 77.

**Generator provenance.** arithmetic.mjs 1.3.0, family filtered-total, instance 36, sampled with seed 20260921 from the latent plan `filtered-total`; this example carries no source span because its statement was generated.

## Result

**Answer.** The kept values are 27, 30 and 20, and their total is 77.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
