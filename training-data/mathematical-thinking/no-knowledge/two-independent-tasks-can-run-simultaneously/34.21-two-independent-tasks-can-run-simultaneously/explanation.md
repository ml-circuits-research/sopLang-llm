# Explanation 34.21 — Two independent tasks can run simultaneously

## Explanation

1. The two tasks use different machines and are independent, so both start at time 0 and run at the same time.
2. Task A needs 5 minutes and task B needs 4 minutes, and both must be finished.
3. The later of the two finishes decides, so both are done after 5 minutes.

Reference solution as printed in the source (chapter 34, 4 steps):

1. A finishes at 5.
2. B finishes at 4.
3. They run simultaneously, so we do not add the durations.
4. We wait until the later finishing time: 5.

## Result

**Answer.** After 5 minutes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
