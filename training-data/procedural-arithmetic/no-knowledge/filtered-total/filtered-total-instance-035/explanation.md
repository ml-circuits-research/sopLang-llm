# Explanation filtered-total-35 — Filtered Total

## Explanation

1. The statement lists 5 values and a threshold of 16.
2. The first stage keeps the values above the threshold: 19, 26, 25, 26.
3. The second stage totals what the first published: 96.

**Generator provenance.** arithmetic.mjs 1.3.0, family filtered-total, instance 35, sampled with seed 20260921 from the latent plan `filtered-total`; this example carries no source span because its statement was generated.

## Result

**Answer.** The kept values are 19, 26, 25 and 26, and their total is 96.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
