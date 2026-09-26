# Explanation 9.6.1 — Two-Step Minimal Split

## Explanation

1. The workload is compressed first: 91 learning units need ceil(91/11) = 9 blocks.
2. The block time and the one-time setup give 9 × 4 + 14 = 50 minutes.
3. That single number is then compared with the limit of 63 minutes, so the plan is feasible; the staffing count is a distractor because the block rate is fixed.
4. First compress the operational details into one number (50 minutes), then compare that output with the deadline. The large problem becomes a workload calculation followed by a pure constraint test.

**Source answer.** The correct answer is yes. First compress the operational details into one number (50 minutes), then compare that output with the deadline. The large problem becomes a workload calculation followed by a pure constraint test. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** 50 minutes: feasible.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
