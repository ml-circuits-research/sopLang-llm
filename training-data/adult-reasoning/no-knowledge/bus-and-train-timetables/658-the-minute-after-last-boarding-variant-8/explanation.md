# Explanation 658 — The minute after last boarding — variant 8

## Explanation

1. Last boarding for the 08:40 departure is 2 minutes before it, that is 08:38, and Ines reaches the Harbour Town stop at 08:37.
2. The arrival is 1 minutes before last boarding, so the 08:40 is caught and the 25-minute ride puts them in Little Halt at 09:05.
3. The statement also removes the 09:10 service on Mondays, so no later departure of the printed timetable stands in for the missed one.

Reference material as printed in the source:

The departure column is not the whole timetable. “Last boarding” cuts a minute that looks harmless. The arithmetic includes the door.

## Result

**Answer.** Yes. Last boarding 08:38. Halt arrival 09:05.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
