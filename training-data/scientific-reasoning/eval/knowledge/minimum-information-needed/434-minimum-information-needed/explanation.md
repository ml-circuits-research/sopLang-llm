# Explanation 434 — Minimum information needed

## Explanation

1. The statement reports the observation “the observed problem exists, but its cause has not yet been located” and leaves both hypotheses possible: H1: the droplets come from condensation and H2: the droplets come from outside.
2. The model of H1 predicts appear on the part cold a of the lid, without hole above, the container contains water warm; the model of H2 predicts appear and when the container e empty, does not depend of the vapor from container, surface external is wet. The observation already made is compatible with both, so it does not separate them.
3. The first prediction of H1 that H2 does not make is “appear on the part cold a of the lid”, and the first prediction of H2 that H1 does not make is “appear and when the container e empty”.
4. Checking “appear on the part cold a of the lid” or “appear and when the container e empty” is enough: the result sends the explanation down one of two different branches, and one observation chosen that way is the minimum information that separates the hypotheses.

Reference solution as printed in the source (form 19, 4 steps):

1. We look for the intersection of the predictions: shared observations do not reduce the number of hypotheses.
2. We then look for the difference between the sets. “appear on the part cold a of the lid” appears only in the predictions of the first hypothesis, while “appear and when the container e empty” only in those of the second, in the model.
3. It is enough to check one of these discriminating predictions; we do not need to measure the entire system.
4. This is the minimum information: a single bit of observation chosen so that the possible results lead to different branches of the decision.

## Result

**Answer.** We check “appear on the part cold a of the lid” (or equivalently “appear and when the container e empty”), because the result separates the two hypotheses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
