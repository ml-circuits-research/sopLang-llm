# Explanation 24.18 — Comparing masses with balance scales

## Explanation

1. Each balance gives one comparison: A > B and B > C, which chain into a single mass ordering without any numerical value.
2. The object that appears as the heavier one and never as the lighter one is the heaviest.

Reference solution as printed in the source (chapter 24, 4 steps):

1. The first balance gives A>B.
2. The second gives B>C.
3. Chaining the relations gives A>B>C.
4. A is at the top of the mass ordering.

## Result

**Answer.** A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
