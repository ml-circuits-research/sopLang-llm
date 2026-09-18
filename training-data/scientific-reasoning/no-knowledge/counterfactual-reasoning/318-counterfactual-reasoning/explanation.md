# Explanation 318 — Counterfactual reasoning

## Explanation

1. In the normal world, the stated start “source lit” reaches light toward object, the object receives light along the given path.
2. The counterfactual world eliminates the node “light toward object” together with every arrow entering or leaving it, so nothing downstream of that node can be produced through this path.
3. Propagating again from the same initial cause leaves light toward object, the object receives light unreachable, so those effects are the ones lost.
4. Nodes that no chain of arrows connects to the stated start were never produced through this path, so blocking this link does not change them.

Reference solution as printed in the source (form 13, 4 steps):

1. In the normal world, from “source lit” we can reach: light toward object, the object receives light.
2. We construct the counterfactual world by eliminating the node “light toward object” and all arrows entering or leaving it.
3. We recalculate the propagation from the same initial cause; no downstream effect remains reachable through this path.
4. The lost effects are: light toward object, the object receives light. These depended on the blocked link in the given network.

## Result

**Answer.** By blocking “light toward object”, we lose along the given path: light toward object, the object receives light.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
