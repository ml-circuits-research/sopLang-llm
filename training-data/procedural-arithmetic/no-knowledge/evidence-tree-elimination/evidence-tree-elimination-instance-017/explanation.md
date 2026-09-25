# Explanation evidence-tree-elimination-17 — Evidence Tree Elimination

## Explanation

1. The scenario handles 6 packages under three hypotheses, so the evidence tree gives every observation one job instead of letting each one speak to all three claims.
2. The capacity log and the independent reproduction within tolerance are the discriminating records that eliminate H2 (the packages handling had insufficient capacity) and H3 (a measurement error slipped into the packages count).
3. The time-stamped record of a dependent action taken before its prerequisite is the one observation that positively tests H1, so that hypothesis survives.
4. The remark that the team was busy tests nothing, and recombining the hypothesis-level verdicts leaves H1 — the dependency/order mistake — as the best-supported explanation.

**Generator provenance.** arithmetic.mjs 1.3.0, family evidence-tree-elimination, instance 17, sampled with seed 20260921 from the latent plan `evidence-tree-elimination`; this example carries no source span because its statement was generated.

## Result

**Answer.** H1, the dependency/order mistake, is the best-supported explanation. The decomposition is evidential: each observation is sent only to the hypothesis it can actually discriminate, then the hypothesis-level results are recombined.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
