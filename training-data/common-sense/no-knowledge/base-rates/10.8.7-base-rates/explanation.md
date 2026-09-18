# Explanation 10.8.7 — Base rates

## Explanation

1. Of the 10000 cases, 5% carry the event, so 500 cases are positive and 9500 are not.
2. The detector catches 92% of the 500: 460 true positives. The remaining 9500 cases alert at the false-positive rate 2%, adding 190 false positives.
3. The positive alerts therefore number 460 + 190 = 650, and 460/650 = 70.8%, so only about 70.8% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 500 cases. True positives = 500 × 92% = 460.
2. Event absent: 9500 cases. False-positive rate = 1 − 0.98 = 0.02, so false positives = 190.
3. Total positive alerts = 650. Therefore P(event | positive) = 460/650 = 70.8%.

## Result

**Answer.** Approximately 70.8% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
