# Explanation 184 — Choosing a discriminating experiment

## Explanation

1. Both hypotheses account for the trouble, so a test that they answer alike cannot separate them; only a prediction one makes and the other refuses can.
2. The first prediction of H1 that H2 does not make is “appear on the part cold a of the lid”, and the first prediction of H2 that H1 does not make is “appear and when the container e empty”.
3. Observing “appear on the part cold a of the lid” supports H1: the droplets come from condensation, while observing “appear and when the container e empty” supports H2: the droplets come from outside.
4. The predictions are written down before the test, so the rule is not changed after the result is seen.

Reference solution as printed in the source (form 9, 4 steps):

1. A useful test is not one for which both hypotheses give the same answer.
2. We choose the discriminating observation “appear on the part cold a of the lid”: it is predicted by the first hypothesis but not by the second in the model.
3. We can also check the counterprediction “appear and when the container e empty”, associated with the second hypothesis.
4. after the test, we compare the observed result with the predictions written beforehand; we do not change the rule after seeing the result.

## Result

**Answer.** We test whether “appear on the part cold a of the lid” (or “appear and when the container e empty”). The appearance of the first supports H1: the droplets come from condensation, while the second result supports H2: the droplets come from outside.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
