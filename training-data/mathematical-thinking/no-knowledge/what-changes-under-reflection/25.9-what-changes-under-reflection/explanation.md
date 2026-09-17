# Explanation 25.9 — What changes under reflection?

## Explanation

1. The arrow points right before the reflection, and the problem states that the vertical mirror swaps left and right while keeping length.
2. Mirroring therefore reverses the direction to left.
3. Every distance inside the arrow is preserved, so the reflected arrow has the same length as the original.

Reference solution as printed in the source (chapter 25, 4 steps):

1. A vertical mirror reverses left-right orientation.
2. The arrow that pointed right will point left.
3. The rule explicitly says that length is preserved.
4. Thus orientation changes, but size does not.

## Result

**Answer.** It will point left and have the same length.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
