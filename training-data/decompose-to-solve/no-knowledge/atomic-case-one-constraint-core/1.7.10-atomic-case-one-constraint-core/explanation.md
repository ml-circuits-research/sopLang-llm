# Explanation 1.7.10 — Atomic Case: One Constraint Core

## Explanation

1. All four rules speak about the same variable: 101 ≤ x ≤ 105, x a multiple of 8, and x + 7 ≤ 111.
2. The resource clause tightens the upper bound to min(105, 111 − 7) = 104.
3. The largest multiple of 8 within the bounds is 104, so the documents take that value.
4. Because every rule constrains the same x, the apparent strands are clauses of one predicate, and decomposing them would only produce fragments that must be recombined immediately.

## Result

**Answer.** The best representation is a single constraint-satisfaction subproblem, yielding x=104. The apparent subproblems are merely clauses of one predicate over the same variable.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
