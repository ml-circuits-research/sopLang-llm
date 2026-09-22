# Explanation parallel-join-deadline-8 — Parallel Join Deadline

## Explanation

1. The design and build tracks run in parallel, so the join waits for the slower one: 63 against 33 minutes.
2. The review step adds 20 minutes after the join.
3. The elapsed time is compared with the 55-minute window: 83 minutes, which does not fit.

**Generator provenance.** arithmetic.mjs 1.2.0, family parallel-join-deadline, instance 8, sampled with seed 20260921 from the latent plan `parallel-join-deadline`; this example carries no source span because its statement was generated.

## Result

**Answer.** The earliest elapsed time is 83 minutes, so the plan does not fit the window.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
