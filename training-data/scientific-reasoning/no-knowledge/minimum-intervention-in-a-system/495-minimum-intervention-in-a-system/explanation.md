# Explanation 495 — Minimum intervention in a system

## Explanation

1. Feasibility first: any combination whose undesired effects include a forbidden effect (sugar over limit) is eliminated, and the rest must cover every target (fiber present, protein present).
2. Among the feasible combinations the smallest total cost is 3, attained by adding a protein source and adding vegetables (2 actions).
3. Every cheaper combination is excluded, because at a lower cost it either misses a target or produces a forbidden effect; no combination at the minimum cost uses fewer actions.
4. The result is therefore minimal in the given search space, and not merely a feasible answer.

Reference solution as printed in the source (form 20, 4 steps):

1. Feasibility: we check which combinations cover all targets and immediately eliminate combinations with a forbidden effect.
2. Cost: among the feasible combinations, the smallest value is 3.
3. Number of actions: at the minimum cost, we choose adding a protein source, adding vegetables (2 actions).
4. Minimality: every lower-cost combination was eliminated because it missed a target or produced a forbidden effect; therefore the solution is not merely good, but minimal in the given search space.

## Result

**Answer.** The minimum intervention is adding a protein source, adding vegetables, with total cost 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
