# Explanation 26.24 — A month with one explicitly added day

## Explanation

1. Both months begin on Monday, so the weekday of the next month differs only by the month length.
2. A month of 28 days shifts the weekday by 28 modulo seven, which is 0, and 29 days shifts it by 1.
3. Applying those shifts to Monday in the weekday order from the fact table names Monday after the shorter month and Tuesday after the longer one; the single added day moves the start by exactly one weekday.

Reference solution as printed in the source (chapter 26, 4 steps):

1. After 28 days exactly 4 weeks pass, so the new month also begins on Monday.
2. 29 days means 28+1.
3. After 28 we are back at Monday, and one more day gives Tuesday.
4. One additional day shifts the next start by one weekday.

## Result

**Answer.** After 28 days: Monday; after 29 days: Tuesday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
