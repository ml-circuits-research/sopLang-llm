# Explanation 330 — Courier journey from Kite to Linden

## Explanation

1. The courier leaves Kite for Linden at 11.0:00, and travel time is distance divided by speed: 120 ÷ 20 = 6.0 hours.
2. Arrival time adds the travel time to the departure hour: 11.0:00 + 6.0 = 17.0:00.
3. The rules allow attending from the beginning only when the arrival is no later than the event start, and 17.0:00 compared with 16.0:00 is later.
4. The meeting has already begun when the courier arrives, so attendance from its beginning is not possible.

Reference solution as printed in the source (family H6, 3 steps):

1. Travel time=120÷20=6.0 hours.
2. Arrival=11.0+6.0=17.0.
3. Compare 17.0 with meeting time 16.0.

## Result

**Answer.** Arrival at about 17.0:00; no, the meeting has already begun.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
