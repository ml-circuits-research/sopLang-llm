# Explanation 947 — The 92 minutes of bridge works — variant 7

## Explanation

1. Ines leaves at 09:20 for the meeting at 10:00, and the bridge works make the bad travel time 92 minutes instead of the good 40.
2. 09:20 + 92 min reaches 10:52, so the bad scenario overruns the immovable 10:00 and the meeting cannot be moved.
3. Planning against the bad scenario means leaving at 08:28, which is 10:00 minus 92 minutes, so the middle and good times are not the ones to plan with.

Reference material as printed in the source:

09:20 covers only the good scenario. Optimism is a scenario, not a plan. The rule is switched on by “cannot be moved”.

## Result

**Answer.** 09:20+92 min overruns 10:00. Required departure: 10:00 minus 92 min.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
