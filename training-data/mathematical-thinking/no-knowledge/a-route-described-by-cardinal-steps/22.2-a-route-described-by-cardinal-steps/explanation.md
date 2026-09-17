# Explanation 22.2 — A route described by cardinal steps

## Explanation

1. Each instruction changes one coordinate: east and west move the column, north and south move the row.
2. Summing the displacements separately gives 2 square(s) east-west and 2 square(s) north-south.
3. Combining the two components places the child 2 squares east and 2 squares north of A.

Reference solution as printed in the source (chapter 22, 4 steps):

1. Horizontally, 3 east and 1 west leave a net displacement of 2 steps east.
2. Vertically, there are 2 steps north and no steps south.
3. The order changes the route, but not the final displacement in this case.
4. The final position is 2 squares east and 2 squares north of A.

## Result

**Answer.** 2 squares east and 2 squares north of A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
