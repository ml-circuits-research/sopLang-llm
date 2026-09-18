# Explanation 579 — Courier journey from Cedar to Grove

## Explanation

1. The courier leaves Cedar for Grove at 10.0:00, and travel time is distance divided by speed: 130 ÷ 25 = 5.2 hours.
2. Arrival time adds the travel time to the departure hour: 10.0:00 + 5.2 = 15.2:00.
3. The rules allow attending from the beginning only when the arrival is no later than the event start, and 15.2:00 compared with 16.2:00 is no later.
4. The courier therefore arrives in time and can be present from the beginning.

Reference solution as printed in the source (family H6, 3 steps):

1. Travel time=130÷25=5.2 hours.
2. Arrival=10.0+5.2=15.2.
3. Compare 15.2 with meeting time 16.2.

## Result

**Answer.** Arrival at about 15.2:00; yes, on time.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
