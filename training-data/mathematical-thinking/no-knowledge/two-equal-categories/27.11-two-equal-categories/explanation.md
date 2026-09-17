# Explanation 27.11 — Two equal categories

## Explanation

1. Equality of values is found by grouping the categories by their number instead of comparing every pair by eye.
2. Grouping A=6, B=4, C=6, D=2 leaves one group with two members, A and C, while every other value appears once.

Reference solution as printed in the source (chapter 27, 4 steps):

1. A has 6.
2. B has 4.
3. C also has 6.
4. D has 2; the only equality is A=C.

## Result

**Answer.** A and C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
