# Explanation 484 — Minimum information needed

## Explanation

1. The statement reports the observation “the observed problem exists, but its cause has not yet been located” and leaves both hypotheses possible: H1: the lack of the layer comes from transport that is too strong and H2: the lack of the layer comes from a lack of fragments.
2. The model of H1 predicts the water is fast-flowing, little deposition, the sediments appear farther downstream; the model of H2 predicts the water may be slow-flowing, no deposits appear in the collector, no fragments are present. The observation already made is compatible with both, so it does not separate them.
3. The first prediction of H1 that H2 does not make is “the water is fast-flowing”, and the first prediction of H2 that H1 does not make is “the water may be slow-flowing”.
4. Checking “the water is fast-flowing” or “the water may be slow-flowing” is enough: the result sends the explanation down one of two different branches, and one observation chosen that way is the minimum information that separates the hypotheses.

Reference solution as printed in the source (form 19, 4 steps):

1. We look for the intersection of the predictions: shared observations do not reduce the number of hypotheses.
2. We then look for the difference between the sets. “the water is fast-flowing” appears only in the predictions of the first hypothesis, while “the water may be slow-flowing” only in those of the second, in the model.
3. It is enough to check one of these discriminating predictions; we do not need to measure the entire system.
4. This is the minimum information: a single bit of observation chosen so that the possible results lead to different branches of the decision.

## Result

**Answer.** We check “the water is fast-flowing” (or equivalently “the water may be slow-flowing”), because the result separates the two hypotheses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
