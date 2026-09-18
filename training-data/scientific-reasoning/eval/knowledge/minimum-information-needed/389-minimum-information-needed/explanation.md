# Explanation 389 — Minimum information needed

## Explanation

1. The statement reports the observation “rabbits decrease” and leaves both hypotheses possible: H1: rabbits decrease from lack of food and H2: rabbits decrease through predation.
2. The model of H1 predicts little grass, rabbits decrease, the tracks of fox must not increase; the model of H2 predicts grass sufficient, rabbits decrease, the tracks of fox increase. The observation already made is compatible with both, so it does not separate them.
3. The first prediction of H1 that H2 does not make is “little grass”, and the first prediction of H2 that H1 does not make is “grass sufficient”.
4. Checking “little grass” or “grass sufficient” is enough: the result sends the explanation down one of two different branches, and one observation chosen that way is the minimum information that separates the hypotheses.

Reference solution as printed in the source (form 19, 4 steps):

1. We look for the intersection of the predictions: shared observations do not reduce the number of hypotheses.
2. We then look for the difference between the sets. “little grass” appears only in the predictions of the first hypothesis, while “grass sufficient” only in those of the second, in the model.
3. It is enough to check one of these discriminating predictions; we do not need to measure the entire system.
4. This is the minimum information: a single bit of observation chosen so that the possible results lead to different branches of the decision.

## Result

**Answer.** We check “little grass” (or equivalently “grass sufficient”), because the result separates the two hypotheses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
