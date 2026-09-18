# Explanation 127 — Predicting a change

## Explanation

1. The change is “water available”, and the 4 rules are followed forward from the states the change activates.
2. The first rule whose condition becomes active gives the direct effect “the seed becomes hydrated”.
3. Each effect then becomes a cause itself, which adds 3 indirect effects in turn: the processes of germination start, the young root emerges, can appear the shoot.
4. A rule whose condition the change never activates contributes nothing, so the answer lists only effects reachable from the initial change.

Reference solution as printed in the source (form 7, 4 steps):

1. The initial change is “water available”.
2. The first direct effect, through the first rule, is “the seed becomes hydrated”.
3. We continue only on the arrows that start from states already activated; we obtain downstream: the processes of germination start, the young root emerges, can appear the shoot.
4. The effects after the first has indirect: they occur because an intermediate change itself becomes a cause.

## Result

**Answer.** Direct effect: the seed becomes hydrated. Downstream effects: the seed becomes hydrated, the processes of germination start, the young root emerges, can appear the shoot.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
