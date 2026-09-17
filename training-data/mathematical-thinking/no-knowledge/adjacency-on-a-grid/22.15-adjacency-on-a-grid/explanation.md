# Explanation 22.15 — Adjacency on a grid

## Explanation

1. Cells share a side exactly when their row and column differ by one in one coordinate and agree in the other, which is the same as a coordinate gap of one in total.
2. Testing each candidate against the subject cell keeps only the side-sharing neighbours and rejects corner-touching cells.

Reference solution as printed in the source (chapter 22, 4 steps):

1. (3,5) differs by one column only, so it is adjacent.
2. (4,5) differs by one row and one column, so it is diagonal and not adjacent.
3. (2,4) differs by one row only, so it is adjacent.
4. (3,2) differs by two columns, so it is not adjacent.

## Result

**Answer.** (3,5) and (2,4).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
