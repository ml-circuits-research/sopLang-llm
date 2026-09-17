# Explanation 22.14 — Map legend and route length

## Explanation

1. The legend converts each drawn square to 100 m, so the route length is the number of drawn squares multiplied by that scale.
2. The route covers 5 squares, giving 500 m.

Reference solution as printed in the source (chapter 22, 4 steps):

1. The route contains 3+2=5 grid-square segments.
2. Each segment represents 100 m.
3. The route length is 5×100=500 m.
4. We do not need the straight-line distance because the problem asks for length along the route.

## Result

**Answer.** 500 m.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
