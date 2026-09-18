# Explanation 7.1.1 — Two-Step Minimal Split

## Explanation

1. The workload is compressed first: 123 sources need ceil(123/10) = 13 blocks.
2. The block time and the one-time setup give 13 × 3 + 7 = 46 minutes.
3. That single number is then compared with the limit of 62 minutes, so the plan is feasible; the staffing count is a distractor because the block rate is fixed.

## Result

**Answer.** The correct answer is yes. First compress the operational details into one number (46 minutes), then compare that output with the deadline. The large problem becomes a workload calculation followed by a pure constraint test.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
