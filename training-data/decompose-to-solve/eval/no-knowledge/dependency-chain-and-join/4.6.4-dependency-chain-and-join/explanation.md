# Explanation 4.6.4 — Dependency Chain and Join

## Explanation

1. The chain starts with A (18 minutes), and B and C run in parallel after it, so only the longer branch matters: max(5, 13) = 13 minutes.
2. The join D (7 minutes) can start once both branches finish, and E (16 minutes) follows D.
3. Adding the mandatory buffer of 3 minutes gives 18 + 13 + 7 + 16 + 3 = 57 minutes.
4. Comparing that earliest safe time with the limit of 54 minutes makes the plan not feasible; the mentioned workload count is a distractor because the durations already include it.

## Result

**Answer.** The earliest safe completion time is 57 minutes, so the plan is not feasible. The critical insight is that B and C are parallel branches whose maximum duration controls the join.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
