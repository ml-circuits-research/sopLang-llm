# Explanation 34.10 — Scheduling tasks on one machine

## Explanation

1. One machine runs the tasks one after another, so the order cannot change how long the whole set takes.
2. The total is the sum of the individual durations 2 + 3 + 1.
3. That sum is 6 minutes, and no waiting or overlap occurs because the machine is never idle.

Reference solution as printed in the source (chapter 34, 4 steps):

1. The machine's time is occupied separately by each task.
2. With no overlap and no breaks, the durations add.
3. 2+3+1=6.
4. The order can change each task's completion time, but not the total.

## Result

**Answer.** 6 minutes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
