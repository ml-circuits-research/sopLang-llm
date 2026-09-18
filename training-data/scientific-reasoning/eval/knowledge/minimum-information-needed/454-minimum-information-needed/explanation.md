# Explanation 454 — Minimum information needed

## Explanation

1. The statement reports the observation “short distance” and leaves both hypotheses possible: H1: the short distance is caused by friction and H2: the short distance is caused by the push.
2. The model of H1 predicts the same push, short distance, rough surface; the model of H2 predicts short distance, identical surface area, weaker push. The observation already made is compatible with both, so it does not separate them.
3. The first prediction of H1 that H2 does not make is “the same push”, and the first prediction of H2 that H1 does not make is “identical surface area”.
4. Checking “the same push” or “identical surface area” is enough: the result sends the explanation down one of two different branches, and one observation chosen that way is the minimum information that separates the hypotheses.

Reference solution as printed in the source (form 19, 4 steps):

1. We look for the intersection of the predictions: shared observations do not reduce the number of hypotheses.
2. We then look for the difference between the sets. “the same push” appears only in the predictions of the first hypothesis, while “identical surface area” only in those of the second, in the model.
3. It is enough to check one of these discriminating predictions; we do not need to measure the entire system.
4. This is the minimum information: a single bit of observation chosen so that the possible results lead to different branches of the decision.

## Result

**Answer.** We check “the same push” (or equivalently “identical surface area”), because the result separates the two hypotheses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
