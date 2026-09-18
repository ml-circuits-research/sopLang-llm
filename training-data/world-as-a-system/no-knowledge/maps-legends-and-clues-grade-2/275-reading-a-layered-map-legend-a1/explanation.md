# Explanation 275 — Reading a layered map legend (A1)

## Explanation

1. The task requires the attribute set ["river","road"], and each cell satisfies the task only when it has every one of those attributes.
2. Intersecting the clue sets leaves one cell B1 in printed order.
3. Extra attributes do not disqualify a cell, and no other cell has all of the required attributes.

Reference solution as printed in the source (family G5, 3 steps):

1. Convert the requested symbols into the attribute set ['river', 'road'].
2. Check each cell for every required attribute.
3. The matching set is ['B1']. Cross-domain check: 11−4=7 independent reports remain.

## Result

**Answer.** B1 Cross-domain answer: 7 independent reports.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
