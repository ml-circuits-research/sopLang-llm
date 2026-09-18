# Explanation 521 — Reading a layered map legend (A1)

## Explanation

1. The task requires the attribute set ["forest","road"], and each cell satisfies the task only when it has every one of those attributes.
2. Intersecting the clue sets leaves the cells A1, B1 in printed order.
3. Extra attributes do not disqualify a cell, and no other cell has all of the required attributes.

Reference solution as printed in the source (family G5, 3 steps):

1. Convert the requested symbols into the attribute set ['forest', 'road'].
2. Check each cell for every required attribute.
3. The matching set is ['A1', 'B1']. Cross-domain check: 8+2=10, so the team finishes at 10:00.

## Result

**Answer.** A1, B1 Cross-domain answer: 10:00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
