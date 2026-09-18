# Explanation 828 — Courier journey from Yarrow to Willow

## Explanation

1. The courier leaves Yarrow for Willow at 9.0:00, and travel time is distance divided by speed: 140 ÷ 30 = 4.7 hours.
2. Arrival time adds the travel time to the departure hour: 9.0:00 + 4.7 = 13.7:00.
3. The rules allow attending from the beginning only when the arrival is no later than the event start, and 13.7:00 compared with 12.7:00 is later.
4. The meeting has already begun when the courier arrives, so attendance from its beginning is not possible.

Reference solution as printed in the source (family H6, 3 steps):

1. Travel time=140÷30=4.7 hours.
2. Arrival=9.0+4.7=13.7.
3. Compare 13.7 with meeting time 12.7.

## Result

**Answer.** Arrival at about 13.7:00; no, the meeting has already begun.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
