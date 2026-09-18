# Explanation 953 — Causality through intervention, not just correlation

## Explanation

1. The initial observation does not separate the factors because “reflects toward right” and “is diagonally oriented” occur together with the increase in “route length”.
2. When we eliminate only “is diagonally oriented” with all other conditions held constant, the increase disappears; this supports its causal role in the submodel.
3. When we eliminate only “reflects toward right”, the increase remains, so the initial association is not sufficient to establish causality for it.
4. The conclusion is limited to the stated interventions and conditions; we do not generalize beyond the model.

Reference solution as printed in the source (form 38, 4 steps):

1. The initial observation does not separate the factors because they occur together.
2. When we eliminate only “is diagonally oriented”, the result changes; this supports its causal role in the submodel.
3. When we eliminate only “reflects toward right”, the result does not change; the initial association is not sufficient to establish causality.
4. The conclusion is limited to the stated interventions and conditions; we do not generalize beyond the model.

## Result

**Answer.** The factor supported as causal is “is diagonally oriented”; “reflects toward right” remains merely associated in the initial data.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
