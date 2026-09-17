# Explanation 34.14 — Filling with two package sizes

## Explanation

1. Filling exactly means finding counts a and b with a×6 + b×4 = 20.
2. Trying the possible counts of A leaves a remainder that must divide by 4; 2 packages A leave 8 units, which is exactly 2 packages B.
3. So the shelf can be filled exactly with 2 A and 2 B.

Reference solution as printed in the source (chapter 34, 4 steps):

1. Try combinations of 6 and 4.
2. Two A packages occupy 12.
3. 8 remain, which is two B packages.
4. 12+8=20 exactly.

## Result

**Answer.** Yes: 2 A and 2 B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
