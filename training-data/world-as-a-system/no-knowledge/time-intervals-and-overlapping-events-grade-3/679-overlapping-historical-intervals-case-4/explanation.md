# Explanation 679 — Overlapping historical intervals: case 4

## Explanation

1. Compare the two started years: the later start is max(160, 160).
2. Compare the two end years: the earlier end is min(205, 194).
3. The earlier end lies after the later start, so the events overlap for 34 years.

Reference solution as printed in the source (family N11, 3 steps):

1. Later start=max(160,160)=160.
2. Earlier end=min(205,194)=194.
3. Difference=194−160=34.

## Result

**Answer.** Yes, overlap 34 years.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
