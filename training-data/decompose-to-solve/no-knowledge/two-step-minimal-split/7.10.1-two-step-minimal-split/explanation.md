# Explanation 7.10.1 — Two-Step Minimal Split

## Explanation

1. The workload is compressed first: 122 experimental results need ceil(122/12) = 11 blocks.
2. The block time and the one-time setup give 11 × 5 + 16 = 71 minutes.
3. That single number is then compared with the limit of 82 minutes, so the plan is feasible; the staffing count is a distractor because the block rate is fixed.

## Result

**Answer.** The correct answer is yes. First compress the operational details into one number (71 minutes), then compare that output with the deadline. The large problem becomes a workload calculation followed by a pure constraint test.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
