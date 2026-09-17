# Explanation 15.2 — Schedule and Duration 2

## Explanation

1. The statement supplies the rule it needs: 1 hour = 60 minutes, and the start time may be converted into minutes counted from 0:00.
2. The start 9:35 becomes 575 minutes, and adding the 50 minutes gives 625 minutes.
3. Converting that total back into hours and minutes gives 10:25, the answer.

Reference solution as printed in the source (chapter 15, 4 steps):

1. Start time in minutes: 9×60+35=575.
2. Add the duration: 575+50=625.
3. Divide 625 by 60: 10 complete hours and 25 minutes.
4. The ending time is 10:25.

## Result

**Answer.** 10:25

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
