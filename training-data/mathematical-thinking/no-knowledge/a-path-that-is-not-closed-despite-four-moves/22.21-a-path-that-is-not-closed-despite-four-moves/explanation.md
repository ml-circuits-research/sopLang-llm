# Explanation 22.21 — A path that is not closed despite four moves

## Explanation

1. The east and west moves cancel here, but two north moves and no south move leave a net displacement northward.
2. The imbalance of the letters is why the path does not close: it ends 2 squares north of the start.

Reference solution as printed in the source (chapter 22, 4 steps):

1. The E and W steps cancel each other.
2. There are two northward steps and no southward step.
3. The final vertical displacement is therefore 2 squares north.
4. The path is not closed.

## Result

**Answer.** No; it ends 2 squares north of the start.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
