# Explanation 36.24 — Choose the fastest route, not the shortest

## Explanation

1. The shorter route is not automatically the faster one, because the routes are traveled at different speeds.
2. Route A takes 12 ÷ 6 = 2 h, route B takes 15 ÷ 10 = 1.5 h.
3. Comparing the travel times rather than the lengths identifies the faster route.

Reference solution as printed in the source (chapter 36, 4 steps):

1. A takes 2 hours.
2. B takes 1.5 hours.
3. Although B is longer, the permitted speed is higher.
4. 1.5<2, so B is faster.

## Result

**Answer.** Route B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
