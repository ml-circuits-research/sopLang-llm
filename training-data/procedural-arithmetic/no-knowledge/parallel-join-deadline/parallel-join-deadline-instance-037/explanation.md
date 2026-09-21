# Explanation parallel-join-deadline-37 — Parallel Join Deadline

## Explanation

1. The draft and review tracks run in parallel, so the join waits for the slower one: 17 against 6 minutes.
2. The review step adds 29 minutes after the join.
3. The elapsed time is compared with the 115-minute window: 46 minutes, which fits.

**Generator provenance.** arithmetic.mjs 1.0.0, family parallel-join-deadline, instance 37, sampled with seed 20260921 from the latent plan `parallel-join-deadline`; this example carries no source span because its statement was generated.

## Result

**Answer.** The earliest elapsed time is 46 minutes, so the plan fits the window.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
