# Explanation 494 — Minimum information needed

## Explanation

1. The statement reports the observation “the observed problem exists, but its cause has not yet been located” and leaves both hypotheses possible: H1: the lack of satiety comes from a portion with too little energy and H2: the lack comes from unsuitable composition.
2. The model of H1 predicts increasing the portion helps, energy below target, protein may be present; the model of H2 predicts energy at target, the required component is missing, changing the composition helps. The observation already made is compatible with both, so it does not separate them.
3. The first prediction of H1 that H2 does not make is “increasing the portion helps”, and the first prediction of H2 that H1 does not make is “energy at target”.
4. Checking “increasing the portion helps” or “energy at target” is enough: the result sends the explanation down one of two different branches, and one observation chosen that way is the minimum information that separates the hypotheses.

Reference solution as printed in the source (form 19, 4 steps):

1. We look for the intersection of the predictions: shared observations do not reduce the number of hypotheses.
2. We then look for the difference between the sets. “increasing the portion helps” appears only in the predictions of the first hypothesis, while “energy at target” only in those of the second, in the model.
3. It is enough to check one of these discriminating predictions; we do not need to measure the entire system.
4. This is the minimum information: a single bit of observation chosen so that the possible results lead to different branches of the decision.

## Result

**Answer.** We check “increasing the portion helps” (or equivalently “energy at target”), because the result separates the two hypotheses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
