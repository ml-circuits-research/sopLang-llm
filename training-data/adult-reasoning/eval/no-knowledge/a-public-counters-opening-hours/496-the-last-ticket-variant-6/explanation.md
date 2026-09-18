# Explanation 496 — The last ticket — variant 6

## Explanation

1. The counter of Bridge City closes at 12:00 on Friday and at 15:00 from Monday to Thursday, and the last ticket is handed out 30 min before closing.
2. Olga asks at 11:50 on Friday and at 14:40 on Monday, and both times are past the printed last-ticket times of 11:30 and 14:30.
3. The 11:00–11:20 break issues no tickets at all, so it cannot rescue an attempt that the last-ticket rule has already refused.

Reference material as printed in the source:

“30 minutes before” is computed on that DAY’s closing hour, which is different on Friday. The break is irrelevant at these times; ticket arithmetic is enough.

## Result

**Answer.** Neither. Friday last ticket 11:30. Monday last ticket 14:30.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
