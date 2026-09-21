# Explanation higher-best-of-two-38 — Higher Best of Two

## Explanation

1. The first stage publishes the best score of the old line, the second the best score of the new line.
2. Comparing the two published values is the whole answer, so no side is rescored in the final stage.
3. the new line wins by 8 points.

**Generator provenance.** arithmetic.mjs 1.1.0, family higher-best-of-two, instance 38, sampled with seed 20260921 from the latent plan `higher-best-of-two`; this example carries no source span because its statement was generated.

## Result

**Answer.** the new line has the higher best score, by 8 points.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
