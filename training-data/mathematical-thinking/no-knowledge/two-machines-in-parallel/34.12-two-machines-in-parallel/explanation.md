# Explanation 34.12 — Two machines in parallel

## Explanation

1. Each machine handles one task at a time, so the 4 tasks are handled in groups of at most 2.
2. That takes 2 rounds of 3 minutes each, and the machines run simultaneously.
3. So all tasks finish after 6 minutes, and the last round cannot be shortened.

Reference solution as printed in the source (chapter 34, 4 steps):

1. In the first 3-minute interval, two tasks can be done in parallel.
2. Two tasks remain.
3. In the second interval, the two machines perform them simultaneously.
4. The minimum total is 6 minutes; in less than 6, at most two tasks could be completed.

## Result

**Answer.** 6 minutes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
