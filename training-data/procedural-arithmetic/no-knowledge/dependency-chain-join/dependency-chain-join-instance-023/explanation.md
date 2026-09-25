# Explanation dependency-chain-join-23 — Dependency Chain Join

## Explanation

1. The chain starts with A (5 minutes), and B and C run in parallel after it, so only the longer branch matters: max(12, 6) = 12 minutes.
2. The join D (12 minutes) can start once both branches finish, and E (9 minutes) follows D.
3. Adding the mandatory buffer of 3 minutes gives 5 + 12 + 12 + 9 + 3 = 41 minutes.
4. Comparing that earliest safe time with the limit of 47 minutes makes the plan feasible.

**Generator provenance.** arithmetic.mjs 1.3.0, family dependency-chain-join, instance 23, sampled with seed 20260921 from the latent plan `dependency-chain-join`; this example carries no source span because its statement was generated.

## Result

**Answer.** The earliest safe completion time is 41 minutes, so the plan is feasible. The critical insight is that B and C are parallel branches whose maximum duration controls the join.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
