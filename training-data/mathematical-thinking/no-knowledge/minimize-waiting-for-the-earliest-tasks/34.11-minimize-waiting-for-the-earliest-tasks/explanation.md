# Explanation 34.11 — Minimize waiting for the earliest tasks

## Explanation

1. A task's completion time counts every task done before it, so an early short task is charged to all later tasks.
2. Ordering the durations as 1, 5 gives a completion-time sum of 7, while the reverse order gives 11.
3. The smaller sum belongs to the order A,B, which places the shortest task first.

Reference solution as printed in the source (chapter 34, 4 steps):

1. In order A,B: A finishes at 1, B at 6; sum 7.
2. In order B,A: B finishes at 5, A at 6; sum 11.
3. 7<11.
4. Putting the short task first reduces the sum of completion times in this case.

## Result

**Answer.** Order A,B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
