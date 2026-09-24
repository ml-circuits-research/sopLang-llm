# Explanation schedule-deadline-feasibility-16 — Schedule Deadline Feasibility

## Explanation

1. The schedule finishes at 16 minutes, which is the longest chain of dependent tasks.
2. The stated deadline is 13 minutes, so the plan is not feasible.
3. The verdict follows the completion time alone: the deadlines of individual tasks are not part of the statement.

**Generator provenance.** arithmetic.mjs 1.3.0, family schedule-deadline-feasibility, instance 16, sampled with seed 20260921 from the latent plan `schedule-deadline-feasibility`; this example carries no source span because its statement was generated.

## Result

**Answer.** No, the tasks finish at 16 minutes, past the 13-minute deadline.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
