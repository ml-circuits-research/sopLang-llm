# Explanation 15.17 — Events at Equal Intervals 2

## Explanation

1. The departures are equally spaced, so the time of the k-th one is the first departure plus k−1 intervals. The statement never states the clock convention, so the 60-minutes-per-hour fact travels on the facts wire.
2. The first bus leaves at 9:00, and the wanted departure is number 5, so it is 4 intervals after the first.
3. Adding 4×15 minutes gives 10:00, the departure time asked for.

Reference solution as printed in the source (chapter 15, 4 steps):

1. Between the first and the 5th departure there are 4 intervals.
2. The total added duration is 4×15=60 minutes.
3. 540+60=600 minutes after midnight.
4. This corresponds to 10:00.

## Result

**Answer.** 10:00

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
