# Explanation 9.10.3 — Base rates

## Explanation

1. Of the 10000 cases, 2% carry the event, so 200 cases are positive and 9800 are not.
2. The detector catches 95% of the 200: 190 true positives. The remaining 9800 cases alert at the false-positive rate 6%, adding 588 false positives.
3. The positive alerts therefore number 190 + 588 = 778, and 190/778 = 24.4%, so only about 24.4% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 200 cases. True positives = 200 × 95% = 190.
2. Event absent: 9800 cases. False-positive rate = 1 − 0.94 = 0.06, so false positives = 588.
3. Total positive alerts = 778. Therefore P(event | positive) = 190/778 = 24.4%.

## Result

**Answer.** Approximately 24.4% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
