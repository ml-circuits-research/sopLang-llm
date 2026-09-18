# Explanation 373 — Counterfactual reasoning

## Explanation

1. In the normal world, the stated start “the same unit” reaches direct comparison along the given path.
2. The counterfactual world eliminates the node “direct comparison” together with every arrow entering or leaving it, so nothing downstream of that node can be produced through this path.
3. Propagating again from the same initial cause leaves direct comparison unreachable, so those effects are the ones lost.
4. Nodes that no chain of arrows connects to the stated start were never produced through this path, so blocking this link does not change them.

Reference solution as printed in the source (form 13, 4 steps):

1. In the normal world, from “the same unit” we can reach: direct comparison.
2. We construct the counterfactual world by eliminating the node “direct comparison” and all arrows entering or leaving it.
3. We recalculate the propagation from the same initial cause; no downstream effect remains reachable through this path.
4. The lost effects are: direct comparison. These depended on the blocked link in the given network.

## Result

**Answer.** By blocking “direct comparison”, we lose along the given path: direct comparison.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
