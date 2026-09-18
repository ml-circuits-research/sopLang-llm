# Explanation 4.6.5 — Base rates

## Explanation

1. Of the 10000 cases, 1% carry the event, so 100 cases are positive and 9900 are not.
2. The detector catches 95% of the 100: 95 true positives. The remaining 9900 cases alert at the false-positive rate 4%, adding 396 false positives.
3. The positive alerts therefore number 95 + 396 = 491, and 95/491 = 19.3%, so only about 19.3% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 100 cases. True positives = 100 × 95% = 95.
2. Event absent: 9900 cases. False-positive rate = 1 − 0.96 = 0.04, so false positives = 396.
3. Total positive alerts = 491. Therefore P(event | positive) = 95/491 = 19.3%.

## Result

**Answer.** Approximately 19.3% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
