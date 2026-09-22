# Explanation filtered-records-at-least-a-threshold-4 — Filtered Records At Least A Threshold

## Explanation

1. The hill depot recorded 7 values, and the threshold is 37 crates.
2. Keeping the records at or above the threshold keeps 4 of them.
3. The kept records total 158 crates.

**Generator provenance.** arithmetic.mjs 1.2.0, family filtered-records-at-least-a-threshold, instance 4, sampled with seed 20260921 from the latent plan `filtered-records-at-least-a-threshold`; this example carries no source span because its statement was generated.

## Result

**Answer.** 4 records were kept, and their total is 158 crates.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
