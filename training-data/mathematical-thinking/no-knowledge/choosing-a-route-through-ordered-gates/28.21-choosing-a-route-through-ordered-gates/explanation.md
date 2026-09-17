# Explanation 28.21 — Choosing a route through ordered gates

## Explanation

1. A route is fixed by the level-1 gate and then the level-2 gate allowed after it.
2. Each first gate contributes its own list of continuations, so the route counts add: A→2 and B→2.
3. The total is 4 distinct routes.

Reference solution as printed in the source (chapter 28, 4 steps):

1. Split by the first gate.
2. A has two allowed continuations.
3. B has two other allowed continuations.
4. The four sequences are distinct.

## Result

**Answer.** 4 routes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
