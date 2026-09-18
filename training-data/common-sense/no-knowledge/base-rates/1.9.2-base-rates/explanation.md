# Explanation 1.9.2 — Base rates

## Explanation

1. Of the 10000 cases, 2% carry the event, so 200 cases are positive and 9800 are not.
2. The detector catches 85% of the 200: 170 true positives. The remaining 9800 cases alert at the false-positive rate 4%, adding 392 false positives.
3. The positive alerts therefore number 170 + 392 = 562, and 170/562 = 30.2%, so only about 30.2% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 200 cases. True positives = 200 × 85% = 170.
2. Event absent: 9800 cases. False-positive rate = 1 − 0.96 = 0.04, so false positives = 392.
3. Total positive alerts = 562. Therefore P(event | positive) = 170/562 = 30.2%.

## Result

**Answer.** Approximately 30.2% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
