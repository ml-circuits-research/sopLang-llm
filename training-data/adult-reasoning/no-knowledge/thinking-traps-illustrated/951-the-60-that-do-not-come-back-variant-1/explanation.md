# Explanation 951 — The 60 that do not come back — variant 1

## Explanation

1. Jules keeps attending only because the 60 was already paid, which is the behaviour the sunk cost trap defines as continuing because the money is in.
2. That sum is gone whether the course is finished or dropped, so staying cannot save it: the 60 are the same on both branches.
3. What staying does add is a new cost — the next hour — on top of a course whose remaining hours do not bring the money back, so the decision must weigh the coming hour, not the spent sum.

Reference material as printed in the source:

Compare futures. The past sum appears the same in “stay” and “leave”, so it does not decide.

## Result

**Answer.** Sunk cost. The 60 are gone on both branches. The next hour is a new cost of time.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
