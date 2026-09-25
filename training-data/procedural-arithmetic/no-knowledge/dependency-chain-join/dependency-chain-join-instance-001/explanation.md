# Explanation dependency-chain-join-1 — Dependency Chain Join

## Explanation

1. The chain starts with A (7 minutes), and B and C run in parallel after it, so only the longer branch matters: max(3, 7) = 7 minutes.
2. The join D (5 minutes) can start once both branches finish, and E (10 minutes) follows D.
3. Adding the mandatory buffer of 2 minutes gives 7 + 7 + 5 + 10 + 2 = 31 minutes.
4. Comparing that earliest safe time with the limit of 28 minutes makes the plan not feasible.

**Generator provenance.** arithmetic.mjs 1.3.0, family dependency-chain-join, instance 1, sampled with seed 20260921 from the latent plan `dependency-chain-join`; this example carries no source span because its statement was generated.

## Result

**Answer.** The earliest safe completion time is 31 minutes, so the plan is not feasible. The critical insight is that B and C are parallel branches whose maximum duration controls the join.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
