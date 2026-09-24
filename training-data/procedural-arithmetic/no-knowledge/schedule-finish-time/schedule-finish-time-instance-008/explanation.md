# Explanation schedule-finish-time-8 — Schedule Finish Time

## Explanation

1. The statement hands 6 tasks and 6 precedence pairs to the schedule.
2. A task can only start once every task that must finish before it has finished, so the completion time is the longest chain of dependent tasks, not the sum of all durations.
3. The longest chain takes 20 minutes, which is the earliest time by which every task is finished.

**Generator provenance.** arithmetic.mjs 1.3.0, family schedule-finish-time, instance 8, sampled with seed 20260921 from the latent plan `schedule-finish-time`; this example carries no source span because its statement was generated.

## Result

**Answer.** The earliest finish time is 20 minutes.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
