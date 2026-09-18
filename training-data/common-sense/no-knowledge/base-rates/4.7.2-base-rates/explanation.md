# Explanation 4.7.2 — Base rates

## Explanation

1. Of the 10000 cases, 1% carry the event, so 100 cases are positive and 9900 are not.
2. The detector catches 92% of the 100: 92 true positives. The remaining 9900 cases alert at the false-positive rate 2%, adding 198 false positives.
3. The positive alerts therefore number 92 + 198 = 290, and 92/290 = 31.7%, so only about 31.7% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 100 cases. True positives = 100 × 92% = 92.
2. Event absent: 9900 cases. False-positive rate = 1 − 0.98 = 0.02, so false positives = 198.
3. Total positive alerts = 290. Therefore P(event | positive) = 92/290 = 31.7%.

## Result

**Answer.** Approximately 31.7% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
