# Explanation 177 — Overlapping historical intervals: case 2

## Explanation

1. Compare the two started years: the later start is max(120, 130).
2. Compare the two end years: the earlier end is min(155, 158).
3. The earlier end lies after the later start, so the events overlap for 25 years.

Reference solution as printed in the source (family N11, 3 steps):

1. Later start=max(120,130)=130.
2. Earlier end=min(155,158)=155.
3. Difference=155−130=25.

## Result

**Answer.** Yes, overlap 25 years.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
