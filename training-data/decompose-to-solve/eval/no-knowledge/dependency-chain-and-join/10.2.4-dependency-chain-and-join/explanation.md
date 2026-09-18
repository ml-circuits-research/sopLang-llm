# Explanation 10.2.4 — Dependency Chain and Join

## Explanation

1. The chain starts with A (9 minutes), and B and C run in parallel after it, so only the longer branch matters: max(16, 11) = 16 minutes.
2. The join D (18 minutes) can start once both branches finish, and E (8 minutes) follows D.
3. Adding the mandatory buffer of 8 minutes gives 9 + 16 + 18 + 8 + 8 = 59 minutes.
4. Comparing that earliest safe time with the limit of 56 minutes makes the plan not feasible; the mentioned workload count is a distractor because the durations already include it.

## Result

**Answer.** The earliest safe completion time is 59 minutes, so the plan is not feasible. The critical insight is that B and C are parallel branches whose maximum duration controls the join.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
