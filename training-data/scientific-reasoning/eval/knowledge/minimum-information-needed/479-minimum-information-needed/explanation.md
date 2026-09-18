# Explanation 479 — Minimum information needed

## Explanation

1. The statement reports the observation “the observed problem exists, but its cause has not yet been located” and leaves both hypotheses possible: H1: alternation comes from rotation of the sphere and H2: alternation comes from turning off the source.
2. The model of H1 predicts the point marked enters and goes out from light, rotation changes the state, the source remains fixed; the model of H2 predicts rotation is not necessary, the source turns off, all the points darkens simultaneously. The observation already made is compatible with both, so it does not separate them.
3. The first prediction of H1 that H2 does not make is “the point marked enters and goes out from light”, and the first prediction of H2 that H1 does not make is “rotation is not necessary”.
4. Checking “the point marked enters and goes out from light” or “rotation is not necessary” is enough: the result sends the explanation down one of two different branches, and one observation chosen that way is the minimum information that separates the hypotheses.

Reference solution as printed in the source (form 19, 4 steps):

1. We look for the intersection of the predictions: shared observations do not reduce the number of hypotheses.
2. We then look for the difference between the sets. “the point marked enters and goes out from light” appears only in the predictions of the first hypothesis, while “rotation is not necessary” only in those of the second, in the model.
3. It is enough to check one of these discriminating predictions; we do not need to measure the entire system.
4. This is the minimum information: a single bit of observation chosen so that the possible results lead to different branches of the decision.

## Result

**Answer.** We check “the point marked enters and goes out from light” (or equivalently “rotation is not necessary”), because the result separates the two hypotheses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
