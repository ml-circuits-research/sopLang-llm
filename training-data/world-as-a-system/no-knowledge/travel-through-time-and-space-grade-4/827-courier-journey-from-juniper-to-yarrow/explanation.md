# Explanation 827 — Courier journey from Juniper to Yarrow

## Explanation

1. The courier leaves Juniper for Yarrow at 8.0:00, and travel time is distance divided by speed: 130 ÷ 30 = 4.3 hours.
2. Arrival time adds the travel time to the departure hour: 8.0:00 + 4.3 = 12.3:00.
3. The rules allow attending from the beginning only when the arrival is no later than the event start, and 12.3:00 compared with 13.3:00 is no later.
4. The courier therefore arrives in time and can be present from the beginning.

Reference solution as printed in the source (family H6, 3 steps):

1. Travel time=130÷30=4.3 hours.
2. Arrival=8.0+4.3=12.3.
3. Compare 12.3 with meeting time 13.3.

## Result

**Answer.** Arrival at about 12.3:00; yes, on time.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
