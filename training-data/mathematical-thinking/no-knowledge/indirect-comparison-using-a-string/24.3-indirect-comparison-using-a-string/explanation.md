# Explanation 24.3 — Indirect comparison using a string

## Explanation

1. The string sits between the two shelves: shelf A is longer than the string, and the string is longer than shelf B.
2. Chaining the comparisons gives shelf A > string > shelf B, and transitivity transfers the comparison to the shelves, so no numbers are needed.

Reference solution as printed in the source (chapter 24, 4 steps):

1. Shelf A is longer than the string.
2. The string is longer than shelf B.
3. By transitivity of comparison, A is longer than B.
4. No numerical values are needed.

## Result

**Answer.** Shelf A is longer than B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
