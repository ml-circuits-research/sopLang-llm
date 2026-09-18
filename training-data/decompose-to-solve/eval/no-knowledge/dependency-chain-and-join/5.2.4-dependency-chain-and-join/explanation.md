# Explanation 5.2.4 — Dependency Chain and Join

## Explanation

1. The chain starts with A (9 minutes), and B and C run in parallel after it, so only the longer branch matters: max(15, 7) = 15 minutes.
2. The join D (15 minutes) can start once both branches finish, and E (8 minutes) follows D.
3. Adding the mandatory buffer of 10 minutes gives 9 + 15 + 15 + 8 + 10 = 57 minutes.
4. Comparing that earliest safe time with the limit of 65 minutes makes the plan feasible; the mentioned workload count is a distractor because the durations already include it.

## Result

**Answer.** The earliest safe completion time is 57 minutes, so the plan is feasible. The critical insight is that B and C are parallel branches whose maximum duration controls the join.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
