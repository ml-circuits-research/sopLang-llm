# Explanation 22.7 — Two different routes, the same destination

## Explanation

1. Order of moves does not matter for the final square: each letter changes the row or the column by one, independent of the others.
2. Both routes use the same counts of N and E letters, so each ends 2 squares east and 2 squares north of the start.

Reference solution as printed in the source (chapter 22, 4 steps):

1. Route A contains two northward and two eastward steps.
2. Route B also contains two northward and two eastward steps.
3. Only the order of the steps differs.
4. Their final displacement from the start is identical.

## Result

**Answer.** Yes; both end 2 squares east and 2 squares north of the start.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
