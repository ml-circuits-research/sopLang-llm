# Explanation 26.16 — Overlapping time intervals

## Explanation

1. Each activity is an interval, 10:00–11:00 for A and 10:30–11:30 for B.
2. The times belonging to both are the interval from the later start to the earlier end, which lasts 30 minutes.
3. That shared stretch is longer than zero, so the two activities do overlap.

Reference solution as printed in the source (chapter 26, 4 steps):

1. A is active after 10:00 and until 11:00.
2. B is active from 10:30.
3. Between 10:30 and 11:00 both are in progress.
4. Therefore there is a common time interval.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
