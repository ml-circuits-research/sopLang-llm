# Explanation parallel-join-deadline-26 — Parallel Join Deadline

## Explanation

1. The survey and prototype tracks run in parallel, so the join waits for the slower one: 64 against 8 minutes.
2. The review step adds 14 minutes after the join.
3. The elapsed time is compared with the 74-minute window: 78 minutes, which does not fit.

**Generator provenance.** arithmetic.mjs 1.3.0, family parallel-join-deadline, instance 26, sampled with seed 20260921 from the latent plan `parallel-join-deadline`; this example carries no source span because its statement was generated.

## Result

**Answer.** The earliest elapsed time is 78 minutes, so the plan does not fit the window.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
