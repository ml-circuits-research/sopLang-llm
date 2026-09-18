# Explanation 347 — A wall 5 degrees colder — variant 7

## Explanation

1. The guide turns a comparison into a sign: mid-room 21 °C against wall 16 °C is a drop of 5 °C, more than the stated 4 °C, so the room has a cold wall.
2. Kara's humidity is 70%, and the guide pairs that level with a cold wall as a condensation risk rather than diagnosing anything.
3. The guide's airing is 5 minutes with a wide window and the radiator off, so a 3-hour tilt with the radiator on breaks that gesture and leaves the sign standing.

Reference material as printed in the source:

We do not diagnose mould. The guide gives a risk and a gesture. Stay at the level of the text.

## Result

**Answer.** 21−16=5>4 cold wall; 70% + cold wall = condensation risk. Long tilt breaks the 5-minute airing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
