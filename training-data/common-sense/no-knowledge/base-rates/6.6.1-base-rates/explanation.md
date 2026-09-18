# Explanation 6.6.1 — Base rates

## Explanation

1. Of the 10000 cases, 5% carry the event, so 500 cases are positive and 9500 are not.
2. The detector catches 90% of the 500: 450 true positives. The remaining 9500 cases alert at the false-positive rate 6%, adding 570 false positives.
3. The positive alerts therefore number 450 + 570 = 1020, and 450/1020 = 44.1%, so only about 44.1% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 500 cases. True positives = 500 × 90% = 450.
2. Event absent: 9500 cases. False-positive rate = 1 − 0.94 = 0.06, so false positives = 570.
3. Total positive alerts = 1020. Therefore P(event | positive) = 450/1020 = 44.1%.

## Result

**Answer.** Approximately 44.1% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
