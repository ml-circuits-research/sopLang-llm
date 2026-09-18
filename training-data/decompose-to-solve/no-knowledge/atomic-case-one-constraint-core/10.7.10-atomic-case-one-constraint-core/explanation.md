# Explanation 10.7.10 — Atomic Case: One Constraint Core

## Explanation

1. All four rules speak about the same variable: 66 ≤ x ≤ 75, x a multiple of 9, and x + 3 ≤ 75.
2. The resource clause tightens the upper bound to min(75, 75 − 3) = 72.
3. The largest multiple of 9 within the bounds is 72, so the restoration tasks take that value.
4. Because every rule constrains the same x, the apparent strands are clauses of one predicate, and decomposing them would only produce fragments that must be recombined immediately.

## Result

**Answer.** The best representation is a single constraint-satisfaction subproblem, yielding x=72. The apparent subproblems are merely clauses of one predicate over the same variable.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
