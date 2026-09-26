# Explanation 7.4.10 — Atomic Case: One Constraint Core

## Explanation

1. All four rules speak about the same variable: 31 ≤ x ≤ 41, x a multiple of 7, and x + 2 ≤ 37.
2. The resource clause tightens the upper bound to min(41, 37 − 2) = 35.
3. The largest multiple of 7 within the bounds is 35, so the data points take that value.
4. Because every rule constrains the same x, the apparent strands are clauses of one predicate, and decomposing them would only produce fragments that must be recombined immediately.
5. The best representation is a single constraint-satisfaction subproblem, yielding x=35. The apparent subproblems are merely clauses of one predicate over the same variable.

**Source answer.** The best representation is a single constraint-satisfaction subproblem, yielding x=35. The apparent subproblems are merely clauses of one predicate over the same variable. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** x = 35.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
