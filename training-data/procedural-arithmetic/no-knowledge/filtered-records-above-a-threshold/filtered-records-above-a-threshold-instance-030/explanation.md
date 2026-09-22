# Explanation filtered-records-above-a-threshold-30 — Filtered Records Above A Threshold

## Explanation

1. The hill depot recorded 4 values, and the threshold is 9 crates.
2. Keeping the records strictly above the threshold keeps 2 of them.
3. The kept records total 46 crates.

**Generator provenance.** arithmetic.mjs 1.2.0, family filtered-records-above-a-threshold, instance 30, sampled with seed 20260921 from the latent plan `filtered-records-above-a-threshold`; this example carries no source span because its statement was generated.

## Result

**Answer.** 2 records were kept, and their total is 46 crates.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
