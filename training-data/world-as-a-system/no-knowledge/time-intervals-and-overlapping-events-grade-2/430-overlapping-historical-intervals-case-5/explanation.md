# Explanation 430 — Overlapping historical intervals: case 5

## Explanation

1. Compare the two started years: the later start is max(180, 190).
2. Compare the two end years: the earlier end is min(220, 221).
3. The earlier end lies after the later start, so the events overlap for 30 years.

Reference solution as printed in the source (family N11, 3 steps):

1. Later start=max(180,190)=190.
2. Earlier end=min(220,221)=220.
3. Difference=220−190=30.

## Result

**Answer.** Yes, overlap 30 years.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
