# Explanation 2.10.1 — Two-Step Minimal Split

## Explanation

1. The workload is compressed first: 81 evacuation groups need ceil(81/15) = 6 blocks.
2. The block time and the one-time setup give 6 × 3 + 11 = 29 minutes.
3. That single number is then compared with the limit of 37 minutes, so the plan is feasible; the staffing count is a distractor because the block rate is fixed.

## Result

**Answer.** The correct answer is yes. First compress the operational details into one number (29 minutes), then compare that output with the deadline. The large problem becomes a workload calculation followed by a pure constraint test.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
