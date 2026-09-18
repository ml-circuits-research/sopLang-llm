# Explanation 6.3.10 — Atomic Case: One Constraint Core

## Explanation

1. All four rules speak about the same variable: 123 ≤ x ≤ 136, x a multiple of 10, and x + 2 ≤ 132.
2. The resource clause tightens the upper bound to min(136, 132 − 2) = 130.
3. The largest multiple of 10 within the bounds is 130, so the institutional actions take that value.
4. Because every rule constrains the same x, the apparent strands are clauses of one predicate, and decomposing them would only produce fragments that must be recombined immediately.

## Result

**Answer.** The best representation is a single constraint-satisfaction subproblem, yielding x=130. The apparent subproblems are merely clauses of one predicate over the same variable.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
