# Explanation 26.21 — The first occurrence after a threshold

## Explanation

1. The departures are the multiples 0, 10, 20, 30, ..., so they are one arithmetic progression with period 10 minutes.
2. Every departure at or before minute 23 is removed, leaving only departures strictly later than the threshold.
3. The first of those is minute 30, since subtracting the period would fall back to or below 23.

Reference solution as printed in the source (chapter 26, 4 steps):

1. 20 is before 23.
2. The next departure after 20 is 30.
3. 30 is strictly greater than 23.
4. There is no other multiple of 10 between 23 and 30.

## Result

**Answer.** Minute 30.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
