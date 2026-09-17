# Explanation 29.15 — De Morgan's rule through a finite example

## Explanation

1. The test negates a disjunction: NOT(red or round).
2. De Morgan's rule turns the negation of an "or" into the conjunction of the two negations.
3. So passing requires both red and round to be absent at the same time.

Reference solution as printed in the source (chapter 29, 4 steps):

1. If it is red, the statement in parentheses is true and the negation is false.
2. If it is round, the same happens.
3. For “red or round” to be false, neither property may be true.
4. Therefore the piece must be not red and not round.

## Result

**Answer.** It must be neither red nor round.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
