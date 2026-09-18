# Explanation 79 — Courier journey from Willow to Harbor

## Explanation

1. The courier leaves Willow for Harbor at 10.0:00, and travel time is distance divided by speed: 90 ÷ 15 = 6.0 hours.
2. Arrival time adds the travel time to the departure hour: 10.0:00 + 6.0 = 16.0:00.
3. The rules allow attending from the beginning only when the arrival is no later than the event start, and 16.0:00 compared with 17.0:00 is no later.
4. The courier therefore arrives in time and can be present from the beginning.

Reference solution as printed in the source (family H6, 3 steps):

1. Travel time=90÷15=6.0 hours.
2. Arrival=10.0+6.0=16.0.
3. Compare 16.0 with meeting time 17.0.

## Result

**Answer.** Arrival at about 16.0:00; yes, on time.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
