# Explanation 15.1 — Schedule and Duration 1

## Explanation

1. The statement supplies the rule it needs: 1 hour = 60 minutes, and the start time may be converted into minutes counted from 0:00.
2. The start 8:20 becomes 500 minutes, and adding the 45 minutes gives 545 minutes.
3. Converting that total back into hours and minutes gives 9:05, the answer.

Reference solution as printed in the source (chapter 15, 4 steps):

1. Start time in minutes: 8×60+20=500.
2. Add the duration: 500+45=545.
3. Divide 545 by 60: 9 complete hours and 5 minutes.
4. The ending time is 9:05.

## Result

**Answer.** 9:05

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
