# Explanation parallel-join-deadline-36 — Parallel Join Deadline

## Explanation

1. The design and build tracks run in parallel, so the join waits for the slower one: 24 against 33 minutes.
2. The review step adds 30 minutes after the join.
3. The elapsed time is compared with the 82-minute window: 63 minutes, which fits.

**Generator provenance.** arithmetic.mjs 1.0.0, family parallel-join-deadline, instance 36, sampled with seed 20260921 from the latent plan `parallel-join-deadline`; this example carries no source span because its statement was generated.

## Result

**Answer.** The earliest elapsed time is 63 minutes, so the plan fits the window.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
