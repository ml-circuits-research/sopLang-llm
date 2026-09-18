# Explanation 329 — Courier journey from Yarrow to Cedar

## Explanation

1. The courier leaves Yarrow for Cedar at 10.0:00, and travel time is distance divided by speed: 110 ÷ 20 = 5.5 hours.
2. Arrival time adds the travel time to the departure hour: 10.0:00 + 5.5 = 15.5:00.
3. The rules allow attending from the beginning only when the arrival is no later than the event start, and 15.5:00 compared with 16.5:00 is no later.
4. The courier therefore arrives in time and can be present from the beginning.

Reference solution as printed in the source (family H6, 3 steps):

1. Travel time=110÷20=5.5 hours.
2. Arrival=10.0+5.5=15.5.
3. Compare 15.5 with meeting time 16.5.

## Result

**Answer.** Arrival at about 15.5:00; yes, on time.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
