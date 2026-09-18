# Explanation 907 — Robust decision-making under uncertainty

## Explanation

1. The possible faulty conditions carry the labels B, C, and exactly one of them is faulty in each scenario, so a robust action must repair all of B, C.
2. Checking the stated actions against that set leaves only W (cost 4), V (cost 3) able to repair every fault that is still possible.
3. Among those, V has the smallest cost (3), so it is the robust action of minimum cost.
4. Every other action is rejected either because some possible fault escapes it or because its cost is higher than 3.

Reference solution as printed in the source (form 37, 4 steps):

1. We turn uncertainty into a set of possible faults, all of which must be covered by the chosen action.
2. The union of the possible faults is {B, C}.
3. We eliminate any action that does not repair every element in this union.
4. Among the actions that guarantee success, the one with minimum cost is V, cost 3.

## Result

**Answer.** The minimum-cost robust action is V, cost 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
