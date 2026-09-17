# Explanation 29.22 — Contradiction from two rules

## Explanation

1. The first rule says every X piece is blue, so the property follows from being X.
2. The second rule says no blue piece is X, so being blue excludes being X.
3. Assuming a X piece exists forces it to be blue and at the same time not blue, a contradiction, so no such piece can exist.

Reference solution as printed in the source (chapter 29, 4 steps):

1. Assume an X piece exists.
2. Rule 1 makes it blue.
3. Rule 2 says any blue piece cannot be X.
4. The same piece would be X and not-X; impossible.

## Result

**Answer.** No X piece can exist.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
