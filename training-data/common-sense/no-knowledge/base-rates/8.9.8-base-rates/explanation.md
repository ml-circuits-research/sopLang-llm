# Explanation 8.9.8 — Base rates

## Explanation

1. Of the 10000 cases, 8% carry the event, so 800 cases are positive and 9200 are not.
2. The detector catches 90% of the 800: 720 true positives. The remaining 9200 cases alert at the false-positive rate 10%, adding 920 false positives.
3. The positive alerts therefore number 720 + 920 = 1640, and 720/1640 = 43.9%, so only about 43.9% of the alerts indicate the event.
4. The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.

Reference solution as printed in the source (template 6, 3 steps):

1. Event present: 800 cases. True positives = 800 × 90% = 720.
2. Event absent: 9200 cases. False-positive rate = 1 − 0.90 = 0.10, so false positives = 920.
3. Total positive alerts = 1640. Therefore P(event | positive) = 720/1640 = 43.9%.

## Result

**Answer.** Approximately 43.9% of positive alerts are true positives.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
