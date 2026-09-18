# Explanation 137 — Predicting a change

## Explanation

1. The change is “more grass”, and the 4 rules are followed forward from the states the change activates.
2. The first rule whose condition becomes active gives the direct effect “more food for rabbits”.
3. Each effect then becomes a cause itself, which adds 3 indirect effects in turn: rabbits better fed, more food available for foxes, the foxes find food more easily.
4. A rule whose condition the change never activates contributes nothing, so the answer lists only effects reachable from the initial change.

Reference solution as printed in the source (form 7, 4 steps):

1. The initial change is “more grass”.
2. The first direct effect, through the first rule, is “more food for rabbits”.
3. We continue only on the arrows that start from states already activated; we obtain downstream: rabbits better fed, more food available for foxes, the foxes find food more easily.
4. The effects after the first has indirect: they occur because an intermediate change itself becomes a cause.

## Result

**Answer.** Direct effect: more food for rabbits. Downstream effects: more food for rabbits, rabbits better fed, more food available for foxes, the foxes find food more easily.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
