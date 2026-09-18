# Explanation 500 — Meta-reasoning: case 5

## Explanation

1. A is no worse than B on cost, time, and safety.
2. It is strictly better on at least one criterion, so A Pareto-dominates B.
3. Dominance needs no weighting: the loser is worse on some criterion and better on none.

Reference solution as printed in the source (family N25, 4 steps):

1. A is cheaper than B.
2. A is faster than B.
3. Safety is equal.
4. A is no worse anywhere and better on two criteria. Cross-domain check: 5×2=10 km.

## Result

**Answer.** A Pareto-dominates B. Cross-domain answer: 10 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
