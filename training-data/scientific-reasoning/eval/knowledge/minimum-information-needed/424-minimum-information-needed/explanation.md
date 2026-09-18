# Explanation 424 — Minimum information needed

## Explanation

1. The statement reports the observation “temperature decreases quickly” and leaves both hypotheses possible: H1: the loss of heat is through material and H2: the loss is through opening.
2. The model of H1 predicts the container remains closed, temperature decreases quickly, a layer insulator helps; the model of H2 predicts temperature decreases quickly, the wall type matters little, closing helps. The observation already made is compatible with both, so it does not separate them.
3. The first prediction of H1 that H2 does not make is “the container remains closed”, and the first prediction of H2 that H1 does not make is “the wall type matters little”.
4. Checking “the container remains closed” or “the wall type matters little” is enough: the result sends the explanation down one of two different branches, and one observation chosen that way is the minimum information that separates the hypotheses.

Reference solution as printed in the source (form 19, 4 steps):

1. We look for the intersection of the predictions: shared observations do not reduce the number of hypotheses.
2. We then look for the difference between the sets. “the container remains closed” appears only in the predictions of the first hypothesis, while “the wall type matters little” only in those of the second, in the model.
3. It is enough to check one of these discriminating predictions; we do not need to measure the entire system.
4. This is the minimum information: a single bit of observation chosen so that the possible results lead to different branches of the decision.

## Result

**Answer.** We check “the container remains closed” (or equivalently “the wall type matters little”), because the result separates the two hypotheses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
