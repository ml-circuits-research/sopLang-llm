# Explanation 3.8.10 — Atomic Case: One Constraint Core

## Explanation

1. All four rules speak about the same variable: 29 ≤ x ≤ 34, x a multiple of 4, and x + 5 ≤ 37.
2. The resource clause tightens the upper bound to min(34, 37 − 5) = 32.
3. The largest multiple of 4 within the bounds is 32, so the printed copies take that value.
4. Because every rule constrains the same x, the apparent strands are clauses of one predicate, and decomposing them would only produce fragments that must be recombined immediately.
5. The best representation is a single constraint-satisfaction subproblem, yielding x=32. The apparent subproblems are merely clauses of one predicate over the same variable.

**Source answer.** The best representation is a single constraint-satisfaction subproblem, yielding x=32. The apparent subproblems are merely clauses of one predicate over the same variable. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** x = 32.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
