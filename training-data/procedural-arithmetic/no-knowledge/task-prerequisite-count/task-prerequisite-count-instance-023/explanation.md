# Explanation task-prerequisite-count-23 — Task Prerequisite Count

## Explanation

1. Task G can start only after every task that must finish before it has finished, directly or transitively.
2. Walking the precedence pairs backwards from G reaches 4 tasks.
3. That is the count of tasks that must finish before task G can start.

**Generator provenance.** arithmetic.mjs 1.3.0, family task-prerequisite-count, instance 23, sampled with seed 20260921 from the latent plan `task-prerequisite-count`; this example carries no source span because its statement was generated.

## Result

**Answer.** 4 tasks must finish before task G can start.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
