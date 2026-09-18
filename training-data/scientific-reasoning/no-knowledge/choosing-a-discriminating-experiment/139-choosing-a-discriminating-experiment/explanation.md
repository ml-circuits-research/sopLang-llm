# Explanation 139 — Choosing a discriminating experiment

## Explanation

1. Both hypotheses account for the trouble, so a test that they answer alike cannot separate them; only a prediction one makes and the other refuses can.
2. The first prediction of H1 that H2 does not make is “little grass”, and the first prediction of H2 that H1 does not make is “grass sufficient”.
3. Observing “little grass” supports H1: rabbits decrease from lack of food, while observing “grass sufficient” supports H2: rabbits decrease through predation.
4. The predictions are written down before the test, so the rule is not changed after the result is seen.

Reference solution as printed in the source (form 9, 4 steps):

1. A useful test is not one for which both hypotheses give the same answer.
2. We choose the discriminating observation “little grass”: it is predicted by the first hypothesis but not by the second in the model.
3. We can also check the counterprediction “grass sufficient”, associated with the second hypothesis.
4. after the test, we compare the observed result with the predictions written beforehand; we do not change the rule after seeing the result.

## Result

**Answer.** We test whether “little grass” (or “grass sufficient”). The appearance of the first supports H1: rabbits decrease from lack of food, while the second result supports H2: rabbits decrease through predation.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
