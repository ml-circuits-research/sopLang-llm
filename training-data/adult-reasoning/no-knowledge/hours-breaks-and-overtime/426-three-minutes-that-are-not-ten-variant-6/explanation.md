# Explanation 426 — Three minutes that are not ten — variant 6

## Explanation

1. The clock marks late only after 09:10, so 09:12, 09:20, 09:15 are late while 09:05 and 09:09 are not.
2. That leaves Three lates on Mon, Wed, Fri, which is the printed warning count of 3 lates/month.
3. Saturday erases nothing: it is not a working day on this clock. The shift itself runs 09:00–17:30 with a break at 12:30–13:00, and extra time after 17:30 needs a slip.

Reference material as printed in the source:

The threshold is 09:10, not “around 9”. Saturday compensation is not provided, so it does not exist in the problem.

## Result

**Answer.** Three: Mon, Wed, Fri. 09:05 and 09:09 ≤ 09:10. Saturday erases nothing: it is not a working day on this clock.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
