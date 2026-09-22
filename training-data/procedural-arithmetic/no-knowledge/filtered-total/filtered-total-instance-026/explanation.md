# Explanation filtered-total-26 — Filtered Total

## Explanation

1. The statement lists 5 values and a threshold of 15.
2. The first stage keeps the values above the threshold: 17, 25, 30, 30.
3. The second stage totals what the first published: 102.

**Generator provenance.** arithmetic.mjs 1.2.0, family filtered-total, instance 26, sampled with seed 20260921 from the latent plan `filtered-total`; this example carries no source span because its statement was generated.

## Result

**Answer.** The kept values are 17, 25, 30 and 30, and their total is 102.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
