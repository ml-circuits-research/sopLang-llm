# Explanation 29.16 — Negating “and” allows at least one failure

## Explanation

1. The rejection test negates a conjunction: NOT(blue and large).
2. De Morgan's rule turns the negation of an "and" into the disjunction of the two negations.
3. A piece is therefore rejected as soon as it lacks blue or lacks large, so only the pieces that are blue and large at once are kept.

Reference solution as printed in the source (chapter 29, 4 steps):

1. A blue and large piece makes the expression in parentheses true, so the negation is false.
2. If it is not blue, the conjunction is false.
3. If it is not large, the conjunction is false.
4. Therefore every piece except one that is both blue and large is rejected.

## Result

**Answer.** All pieces that are not simultaneously blue and large.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
