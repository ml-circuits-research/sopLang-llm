# Explanation 10.10.1 — Base rates

## Explanation

1. Of the 10000 cases, 2% carry the event, so 200 cases are positive and 9800 are not.
2. The detector catches 90% of the 200: 180 true positives. The remaining 9800 cases alert at the false-positive rate 10%, adding 980 false positives.
3. The positive alerts therefore number 180 + 980 = 1160, and 180/1160 = 15.5%, so only about 15.5% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 200 cases. True positives = 200 × 90% = 180.
2. Event absent: 9800 cases. False-positive rate = 1 − 0.90 = 0.10, so false positives = 980.
3. Total positive alerts = 1160. Therefore P(event | positive) = 180/1160 = 15.5%.

## Result

**Answer.** Approximately 15.5% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
