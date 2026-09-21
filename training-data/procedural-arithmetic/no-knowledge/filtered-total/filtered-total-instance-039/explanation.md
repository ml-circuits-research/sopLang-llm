# Explanation filtered-total-39 — Filtered Total

## Explanation

1. The statement lists 6 values and a threshold of 14.
2. The first stage keeps the values above the threshold: 22, 28, 22, 20.
3. The second stage totals what the first published: 92.

**Generator provenance.** arithmetic.mjs 1.1.0, family filtered-total, instance 39, sampled with seed 20260921 from the latent plan `filtered-total`; this example carries no source span because its statement was generated.

## Result

**Answer.** The kept values are 22, 28, 22 and 20, and their total is 92.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
