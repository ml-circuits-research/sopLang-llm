# Explanation 576 — Courier journey from Iris to Riverbend

## Explanation

1. The courier leaves Iris for Riverbend at 7.0:00, and travel time is distance divided by speed: 100 ÷ 25 = 4.0 hours.
2. Arrival time adds the travel time to the departure hour: 7.0:00 + 4.0 = 11.0:00.
3. The rules allow attending from the beginning only when the arrival is no later than the event start, and 11.0:00 compared with 10.0:00 is later.
4. The meeting has already begun when the courier arrives, so attendance from its beginning is not possible.

Reference solution as printed in the source (family H6, 3 steps):

1. Travel time=100÷25=4.0 hours.
2. Arrival=7.0+4.0=11.0.
3. Compare 11.0 with meeting time 10.0.

## Result

**Answer.** Arrival at about 11.0:00; no, the meeting has already begun.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
