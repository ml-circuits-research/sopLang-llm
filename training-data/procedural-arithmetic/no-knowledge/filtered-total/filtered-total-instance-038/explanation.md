# Explanation filtered-total-38 — Filtered Total

## Explanation

1. The statement lists 6 values and a threshold of 11.
2. The first stage keeps the values above the threshold: 28, 28.
3. The second stage totals what the first published: 56.

**Generator provenance.** arithmetic.mjs 1.0.0, family filtered-total, instance 38, sampled with seed 20260921 from the latent plan `filtered-total`; this example carries no source span because its statement was generated.

## Result

**Answer.** The kept values are 28 and 28, and their total is 56.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
