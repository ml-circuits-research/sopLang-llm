# Explanation 8.3.6 — Base rates

## Explanation

1. Of the 10000 cases, 8% carry the event, so 800 cases are positive and 9200 are not.
2. The detector catches 92% of the 800: 736 true positives. The remaining 9200 cases alert at the false-positive rate 6%, adding 552 false positives.
3. The positive alerts therefore number 736 + 552 = 1288, and 736/1288 = 57.1%, so only about 57.1% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 800 cases. True positives = 800 × 92% = 736.
2. Event absent: 9200 cases. False-positive rate = 1 − 0.94 = 0.06, so false positives = 552.
3. Total positive alerts = 1288. Therefore P(event | positive) = 736/1288 = 57.1%.

## Result

**Answer.** Approximately 57.1% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
