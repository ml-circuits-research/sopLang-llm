# Explanation 5.8.4 — Dependency Chain and Join

## Explanation

1. The chain starts with A (6 minutes), and B and C run in parallel after it, so only the longer branch matters: max(15, 18) = 18 minutes.
2. The join D (10 minutes) can start once both branches finish, and E (10 minutes) follows D.
3. Adding the mandatory buffer of 6 minutes gives 6 + 18 + 10 + 10 + 6 = 50 minutes.
4. Comparing that earliest safe time with the limit of 44 minutes makes the plan not feasible; the mentioned workload count is a distractor because the durations already include it.
5. The critical insight is that B and C are parallel branches whose maximum duration controls the join.

**Source answer.** The earliest safe completion time is 50 minutes, so the plan is not feasible. The critical insight is that B and C are parallel branches whose maximum duration controls the join. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** 50 minutes: not feasible.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
