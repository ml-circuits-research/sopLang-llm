# Explanation 937 — Robust decision-making under uncertainty

## Explanation

1. The possible faulty conditions carry the labels A, B, and exactly one of them is faulty in each scenario, so a robust action must repair all of A, B.
2. Checking the stated actions against that set leaves only Z (cost 2), W (cost 4) able to repair every fault that is still possible.
3. Among those, Z has the smallest cost (2), so it is the robust action of minimum cost.
4. Every other action is rejected either because some possible fault escapes it or because its cost is higher than 2.

Reference solution as printed in the source (form 37, 4 steps):

1. We turn uncertainty into a set of possible faults, all of which must be covered by the chosen action.
2. The union of the possible faults is {A, B}.
3. We eliminate any action that does not repair every element in this union.
4. Among the actions that guarantee success, the one with minimum cost is Z, cost 2.

## Result

**Answer.** The minimum-cost robust action is Z, cost 2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
