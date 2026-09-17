# Explanation 24.19 — Balance with equality and comparison

## Explanation

1. A and B balance perfectly, so they have the same mass and either can replace the other in a comparison.
2. The statement gives B > C, and replacing B by its equally heavy partner transfers the comparison to that partner.

Reference solution as printed in the source (chapter 24, 4 steps):

1. A=B means A can replace B in the comparison.
2. We know B>C.
3. Replacing B by the equal mass A gives A>C.
4. Therefore A is heavier than C.

## Result

**Answer.** A is heavier than C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
