# Explanation 25.3 — Sticks for two triangles sharing a side

## Explanation

1. The first triangle uses 3 sticks.
2. Every further triangle reuses one existing side, so it adds only the remaining 2 sticks.
3. With 2 triangles altogether the count is 5 sticks.

Reference solution as printed in the source (chapter 25, 4 steps):

1. The first triangle requires 3 sticks.
2. The second would require 3 if it were separate.
3. But one side is already built and is shared.
4. We add only 2 sticks: 3+2=5.

## Result

**Answer.** 5 sticks.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
