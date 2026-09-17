# Explanation 29.2 — The “or” condition allows one or both

## Explanation

1. Inclusive "or" is satisfied by either property, so a piece passes as soon as it has red or round.
2. Checking each piece against the two properties keeps every piece that has at least one of them.
3. The result is A, B, and C, because the pieces with neither property are the only ones rejected.

Reference solution as printed in the source (chapter 29, 4 steps):

1. A is red, so it is accepted.
2. B is round, so it is accepted.
3. C has both properties and is accepted.
4. D has neither property, so it is rejected.

## Result

**Answer.** A, B, and C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
