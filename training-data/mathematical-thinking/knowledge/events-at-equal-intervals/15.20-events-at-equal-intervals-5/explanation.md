# Explanation 15.20 — Events at Equal Intervals 5

## Explanation

1. The departures are equally spaced, so the time of the k-th one is the first departure plus k−1 intervals. The statement never states the clock convention, so the 60-minutes-per-hour fact travels on the facts wire.
2. The first bus leaves at 14:00, and the wanted departure is number 5, so it is 4 intervals after the first.
3. Adding 4×20 minutes gives 15:20, the departure time asked for.

Reference solution as printed in the source (chapter 15, 4 steps):

1. Between the first and the 5th departure there are 4 intervals.
2. The total added duration is 4×20=80 minutes.
3. 840+80=920 minutes after midnight.
4. This corresponds to 15:20.

## Result

**Answer.** 15:20

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
