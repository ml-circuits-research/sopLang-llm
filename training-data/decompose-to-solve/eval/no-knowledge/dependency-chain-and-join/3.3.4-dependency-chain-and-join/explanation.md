# Explanation 3.3.4 — Dependency Chain and Join

## Explanation

1. The chain starts with A (6 minutes), and B and C run in parallel after it, so only the longer branch matters: max(18, 9) = 18 minutes.
2. The join D (14 minutes) can start once both branches finish, and E (17 minutes) follows D.
3. Adding the mandatory buffer of 6 minutes gives 6 + 18 + 14 + 17 + 6 = 61 minutes.
4. Comparing that earliest safe time with the limit of 55 minutes makes the plan not feasible; the mentioned workload count is a distractor because the durations already include it.

## Result

**Answer.** The earliest safe completion time is 61 minutes, so the plan is not feasible. The critical insight is that B and C are parallel branches whose maximum duration controls the join.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
