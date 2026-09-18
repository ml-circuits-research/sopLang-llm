# Explanation 6.4.7 — Base rates

## Explanation

1. Of the 10000 cases, 3% carry the event, so 300 cases are positive and 9700 are not.
2. The detector catches 92% of the 300: 276 true positives. The remaining 9700 cases alert at the false-positive rate 4%, adding 388 false positives.
3. The positive alerts therefore number 276 + 388 = 664, and 276/664 = 41.6%, so only about 41.6% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 300 cases. True positives = 300 × 92% = 276.
2. Event absent: 9700 cases. False-positive rate = 1 − 0.96 = 0.04, so false positives = 388.
3. Total positive alerts = 664. Therefore P(event | positive) = 276/664 = 41.6%.

## Result

**Answer.** Approximately 41.6% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
