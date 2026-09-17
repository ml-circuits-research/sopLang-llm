# Explanation 35.25 — Two opposing processes: inflow and loss

## Explanation

1. Water enters at 7 L/min while 2 L/min leaks out at the same time.
2. The stated model defines the net rate as the inflow minus the outflow: 7 - 2.
3. The volume therefore grows by 5 L each minute.

Reference solution as printed in the source (chapter 35, 4 steps):

1. In one minute, 7 L enter.
2. In the same minute, 2 L leave.
3. The net change is 7-2=5.
4. Volume increases by 5 L per minute.

## Result

**Answer.** 5 L/min.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
