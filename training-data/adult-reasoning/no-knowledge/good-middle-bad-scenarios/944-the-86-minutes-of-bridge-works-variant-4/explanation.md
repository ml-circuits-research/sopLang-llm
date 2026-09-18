# Explanation 944 — The 86 minutes of bridge works — variant 4

## Explanation

1. Rita leaves at 09:20 for the meeting at 10:00, and the bridge works make the bad travel time 86 minutes instead of the good 40.
2. 09:20 + 86 min reaches 10:46, so the bad scenario overruns the immovable 10:00 and the meeting cannot be moved.
3. Planning against the bad scenario means leaving at 08:34, which is 10:00 minus 86 minutes, so the middle and good times are not the ones to plan with.

Reference material as printed in the source:

09:20 covers only the good scenario. Optimism is a scenario, not a plan. The rule is switched on by “cannot be moved”.

## Result

**Answer.** 09:20+86 min overruns 10:00. Required departure: 10:00 minus 86 min.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
