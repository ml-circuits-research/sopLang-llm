# Explanation 578 — Courier journey from Linden to Willow

## Explanation

1. The courier leaves Linden for Willow at 9.0:00, and travel time is distance divided by speed: 120 ÷ 25 = 4.8 hours.
2. Arrival time adds the travel time to the departure hour: 9.0:00 + 4.8 = 13.8:00.
3. The rules allow attending from the beginning only when the arrival is no later than the event start, and 13.8:00 compared with 12.8:00 is later.
4. The meeting has already begun when the courier arrives, so attendance from its beginning is not possible.

Reference solution as printed in the source (family H6, 3 steps):

1. Travel time=120÷25=4.8 hours.
2. Arrival=9.0+4.8=13.8.
3. Compare 13.8 with meeting time 12.8.

## Result

**Answer.** Arrival at about 13.8:00; no, the meeting has already begun.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
