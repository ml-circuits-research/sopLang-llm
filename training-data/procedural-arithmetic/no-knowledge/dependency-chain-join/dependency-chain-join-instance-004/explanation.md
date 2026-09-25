# Explanation dependency-chain-join-4 — Dependency Chain Join

## Explanation

1. The chain starts with A (9 minutes), and B and C run in parallel after it, so only the longer branch matters: max(9, 7) = 9 minutes.
2. The join D (9 minutes) can start once both branches finish, and E (3 minutes) follows D.
3. Adding the mandatory buffer of 5 minutes gives 9 + 9 + 9 + 3 + 5 = 35 minutes.
4. Comparing that earliest safe time with the limit of 29 minutes makes the plan not feasible.

**Generator provenance.** arithmetic.mjs 1.3.0, family dependency-chain-join, instance 4, sampled with seed 20260921 from the latent plan `dependency-chain-join`; this example carries no source span because its statement was generated.

## Result

**Answer.** The earliest safe completion time is 35 minutes, so the plan is not feasible. The critical insight is that B and C are parallel branches whose maximum duration controls the join.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
