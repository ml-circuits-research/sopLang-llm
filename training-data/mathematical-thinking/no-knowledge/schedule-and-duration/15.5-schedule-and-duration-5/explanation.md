# Explanation 15.5 — Schedule and Duration 5

## Explanation

1. The statement supplies the rule it needs: 1 hour = 60 minutes, and the start time may be converted into minutes counted from 0:00.
2. The start 15:50 becomes 950 minutes, and adding the 35 minutes gives 985 minutes.
3. Converting that total back into hours and minutes gives 16:25, the answer.

Reference solution as printed in the source (chapter 15, 4 steps):

1. Start time in minutes: 15×60+50=950.
2. Add the duration: 950+35=985.
3. Divide 985 by 60: 16 complete hours and 25 minutes.
4. The ending time is 16:25.

## Result

**Answer.** 16:25

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
