# Explanation 40.15 — Plan with dependency and value

## Explanation

1. The budget is 3 minutes, and a plan is feasible only when every chosen task fits and each prerequisite is chosen with it.
2. C takes 3 minutes and is worth 6 points, while the dependent task needs its prerequisite as well and no longer fits.
3. So the best feasible choice is C.

Reference solution as printed in the source (chapter 40, 4 steps):

1. B cannot be done by itself.
2. The required package A+B takes 4 minutes, above the budget of 3.
3. C takes exactly 3.
4. The only valuable feasible choice is C.

## Result

**Answer.** C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
