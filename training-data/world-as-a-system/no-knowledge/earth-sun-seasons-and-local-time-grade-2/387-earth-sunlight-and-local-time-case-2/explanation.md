# Explanation 387 — Earth, sunlight, and local time: case 2

## Explanation

1. Each time zone east adds one hour and each zone west subtracts one, so Eastport is 2 hour(s) later than Westport.
2. Shifting the stated clock 10:00 by 2 hour(s) gives the local time 12:00.
3. The shift is taken modulo 24 hours, so the answer is the local clock of the asked place.

Reference solution as printed in the source (family N3, 2 steps):

1. Time difference is +2 hour(s) because Eastport is east.
2. 10+2=12 (mod 24).

## Result

**Answer.** 12:00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
