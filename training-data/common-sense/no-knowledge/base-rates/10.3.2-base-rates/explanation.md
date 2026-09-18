# Explanation 10.3.2 — Base rates

## Explanation

1. Of the 10000 cases, 3% carry the event, so 300 cases are positive and 9700 are not.
2. The detector catches 95% of the 300: 285 true positives. The remaining 9700 cases alert at the false-positive rate 6%, adding 582 false positives.
3. The positive alerts therefore number 285 + 582 = 867, and 285/867 = 32.9%, so only about 32.9% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 300 cases. True positives = 300 × 95% = 285.
2. Event absent: 9700 cases. False-positive rate = 1 − 0.94 = 0.06, so false positives = 582.
3. Total positive alerts = 867. Therefore P(event | positive) = 285/867 = 32.9%.

## Result

**Answer.** Approximately 32.9% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
