# Explanation 152 — Predicting a change

## Explanation

1. The change is “effective chewing”, and the 4 rules are followed forward from the states the change activates.
2. The first rule whose condition becomes active gives the direct effect “smaller pieces”.
3. Each effect then becomes a cause itself, which adds 1 indirect effect in turn: food is mixed more easily.
4. A rule whose condition the change never activates contributes nothing, so the answer lists only effects reachable from the initial change.

Reference solution as printed in the source (form 7, 4 steps):

1. The initial change is “effective chewing”.
2. The first direct effect, through the first rule, is “smaller pieces”.
3. We continue only on the arrows that start from states already activated; we obtain downstream: food is mixed more easily.
4. The effects after the first has indirect: they occur because an intermediate change itself becomes a cause.

## Result

**Answer.** Direct effect: smaller pieces. Downstream effects: smaller pieces, food is mixed more easily.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
