# Explanation 226 — A missed dose is not hunted — variant 6

## Explanation

1. Ned is 34 and took the adult dose of 10 ml at 07:00, then let the 15:00 dose pass, so the leaflet says it is skipped and not doubled.
2. At 19:30 the amount the text allows is the ordinary adult dose, 10 ml, not the 20 ml of a catch-up dose.
3. The leaflet caps the day at 3 doses and 30 ml, and the weight of 75 kg never enters the adult schedule.
4. The plausible-looking arithmetic of doubling for a missed dose is exactly what the text rules out.

Reference material as printed in the source:

The adult schedule is fixed. 07:00 was taken; a miss is not hunted. 19:30 is after the 8-hour gap from 07:00, so 10 ml fits the 30 ml cap (10+10=20). 20 ml would be a doubling. A protocol is executed, not “corrected”.

## Result

**Answer.** At most 10 ml (not 20). Weight is not a parameter of the adult schedule.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
