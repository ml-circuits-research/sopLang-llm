# Explanation 258 — The 7 hours are not an average — variant 8

## Explanation

1. The protocol fixes lights out at 23:00, so coffee stops 8 h earlier, by 15:00, and screens go off 45 min earlier, by 22:15.
2. Rita drinks coffee at 16:30 and stays on the phone until 23:20, so both windows are missed.
3. The plan also moves lights out to 23:40 and the rise to 07:10, and it naps 40 min at 15:30, after the 15:00 deadline and longer than the 20 min allowed.
4. The target of 7 h 30 min in bed is not an average to be traded across the week, so the breaches stand on their own, and rising at 07:10 leaves only 20 min before the 07:30 departure from Stadium District.

Reference material as printed in the source:

23:40–07:10 can be 7 h 30 numerically, but the protocol anchors the hours, not only the duration. A correct duration on wrong hours is still a breach.

## Result

**Answer.** Coffee too late (last would be 15:00); screen after 22:15; bedtime and rising moved; nap after 15:00 and too long. At least four breaches.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
