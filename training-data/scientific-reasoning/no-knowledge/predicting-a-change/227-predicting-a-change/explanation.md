# Explanation 227 — Predicting a change

## Explanation

1. The change is “the part oriented toward Sun”, and the 4 rules are followed forward from the states the change activates.
2. The first rule whose condition becomes active gives the direct effect “day”.
3. No other rule starts from an activated state, so no further effect appears and the direct effect is the whole downstream list.
4. A rule whose condition the change never activates contributes nothing, so the answer lists only effects reachable from the initial change.

Reference solution as printed in the source (form 7, 4 steps):

1. The initial change is “the part oriented toward Sun”.
2. The first direct effect, through the first rule, is “day”.
3. We continue only on the arrows that start from states already activated; we obtain downstream: no another effect.
4. The effects after the first has indirect: they occur because an intermediate change itself becomes a cause.

## Result

**Answer.** Direct effect: day. Downstream effects: day.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
