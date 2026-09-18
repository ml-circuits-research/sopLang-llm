# Explanation 926 — Overlapping historical intervals: case 1

## Explanation

1. Compare the two started years: the later start is max(100, 100).
2. Compare the two end years: the earlier end is min(150, 137).
3. The earlier end lies after the later start, so the events overlap for 37 years.

Reference solution as printed in the source (family N11, 3 steps):

1. Later start=max(100,100)=100.
2. Earlier end=min(150,137)=137.
3. Difference=137−100=37.

## Result

**Answer.** Yes, overlap 37 years.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
