# Explanation filtered-total-21 — Filtered Total

## Explanation

1. The statement lists 6 values and a threshold of 8.
2. The first stage keeps the values above the threshold: 26, 10, 27, 11.
3. The second stage totals what the first published: 74.

**Generator provenance.** arithmetic.mjs 1.0.0, family filtered-total, instance 21, sampled with seed 20260921 from the latent plan `filtered-total`; this example carries no source span because its statement was generated.

## Result

**Answer.** The kept values are 26, 10, 27 and 11, and their total is 74.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
