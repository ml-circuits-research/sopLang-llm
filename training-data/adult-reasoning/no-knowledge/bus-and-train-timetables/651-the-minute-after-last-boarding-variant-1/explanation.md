# Explanation 651 — The minute after last boarding — variant 1

## Explanation

1. Last boarding for the 08:40 departure is 2 minutes before it, that is 08:38, and Ann reaches the Maple Ward stop at 08:39.
2. The arrival is 1 minutes past last boarding, so the 08:40 is missed.
3. The statement also removes the 09:10 service on Mondays, so no later departure of the printed timetable stands in for the missed one.

Reference material as printed in the source:

The departure column is not the whole timetable. “Last boarding” cuts a minute that looks harmless. The arithmetic includes the door.

## Result

**Answer.** No. Last boarding 08:38. 08:39 is late. There is no 09:10 on Monday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
