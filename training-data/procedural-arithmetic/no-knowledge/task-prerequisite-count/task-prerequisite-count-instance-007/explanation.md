# Explanation task-prerequisite-count-7 — Task Prerequisite Count

## Explanation

1. Task C can start only after every task that must finish before it has finished, directly or transitively.
2. Walking the precedence pairs backwards from C reaches 2 tasks.
3. That is the count of tasks that must finish before task C can start.

**Generator provenance.** arithmetic.mjs 1.3.0, family task-prerequisite-count, instance 7, sampled with seed 20260921 from the latent plan `task-prerequisite-count`; this example carries no source span because its statement was generated.

## Result

**Answer.** 2 tasks must finish before task C can start.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
