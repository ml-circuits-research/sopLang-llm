# Explanation filtered-total-28 — Filtered Total

## Explanation

1. The statement lists 5 values and a threshold of 13.
2. The first stage keeps the values above the threshold: 18, 22, 29.
3. The second stage totals what the first published: 69.

**Generator provenance.** arithmetic.mjs 1.3.0, family filtered-total, instance 28, sampled with seed 20260921 from the latent plan `filtered-total`; this example carries no source span because its statement was generated.

## Result

**Answer.** The kept values are 18, 22 and 29, and their total is 69.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
