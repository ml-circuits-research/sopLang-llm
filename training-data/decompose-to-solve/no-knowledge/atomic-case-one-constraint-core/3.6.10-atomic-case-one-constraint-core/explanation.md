# Explanation 3.6.10 — Atomic Case: One Constraint Core

## Explanation

1. All four rules speak about the same variable: 49 ≤ x ≤ 59, x a multiple of 9, and x + 4 ≤ 58.
2. The resource clause tightens the upper bound to min(59, 58 − 4) = 54.
3. The largest multiple of 9 within the bounds is 54, so the stock units take that value.
4. Because every rule constrains the same x, the apparent strands are clauses of one predicate, and decomposing them would only produce fragments that must be recombined immediately.
5. The best representation is a single constraint-satisfaction subproblem, yielding x=54. The apparent subproblems are merely clauses of one predicate over the same variable.

**Source answer.** The best representation is a single constraint-satisfaction subproblem, yielding x=54. The apparent subproblems are merely clauses of one predicate over the same variable. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** x = 54.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
