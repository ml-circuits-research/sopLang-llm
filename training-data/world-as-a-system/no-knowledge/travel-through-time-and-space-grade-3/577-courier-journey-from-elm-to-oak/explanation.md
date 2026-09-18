# Explanation 577 — Courier journey from Elm to Oak

## Explanation

1. The courier leaves Elm for Oak at 8.0:00, and travel time is distance divided by speed: 110 ÷ 25 = 4.4 hours.
2. Arrival time adds the travel time to the departure hour: 8.0:00 + 4.4 = 12.4:00.
3. The rules allow attending from the beginning only when the arrival is no later than the event start, and 12.4:00 compared with 13.4:00 is no later.
4. The courier therefore arrives in time and can be present from the beginning.

Reference solution as printed in the source (family H6, 3 steps):

1. Travel time=110÷25=4.4 hours.
2. Arrival=8.0+4.4=12.4.
3. Compare 12.4 with meeting time 13.4.

## Result

**Answer.** Arrival at about 12.4:00; yes, on time.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
