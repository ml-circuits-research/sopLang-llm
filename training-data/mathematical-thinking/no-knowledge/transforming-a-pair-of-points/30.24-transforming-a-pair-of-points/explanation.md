# Explanation 30.24 — Transforming a pair of points

## Explanation

1. The same translation adds 3 to the row and -1 to the column of every point.
2. P=(2,2) becomes (5,1) and Q=(2,5) becomes (5,4).
3. Both images keep the same row, so the two points are still on the same row as each other.

Reference solution as printed in the source (chapter 30, 4 steps):

1. For P: (2+3,2−1)=(5,1).
2. For Q: (2+3,5−1)=(5,4).
3. Both have new row 5.
4. The relation “same row” has been preserved.

## Result

**Answer.** P′=(5,1), Q′=(5,4); yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
