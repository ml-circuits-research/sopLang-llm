# Explanation 204 — Choosing a discriminating experiment

## Explanation

1. Both hypotheses account for the trouble, so a test that they answer alike cannot separate them; only a prediction one makes and the other refuses can.
2. The first prediction of H1 that H2 does not make is “the same push”, and the first prediction of H2 that H1 does not make is “identical surface area”.
3. Observing “the same push” supports H1: the short distance is caused by friction, while observing “identical surface area” supports H2: the short distance is caused by the push.
4. The predictions are written down before the test, so the rule is not changed after the result is seen.

Reference solution as printed in the source (form 9, 4 steps):

1. A useful test is not one for which both hypotheses give the same answer.
2. We choose the discriminating observation “the same push”: it is predicted by the first hypothesis but not by the second in the model.
3. We can also check the counterprediction “identical surface area”, associated with the second hypothesis.
4. after the test, we compare the observed result with the predictions written beforehand; we do not change the rule after seeing the result.

## Result

**Answer.** We test whether “the same push” (or “identical surface area”). The appearance of the first supports H1: the short distance is caused by friction, while the second result supports H2: the short distance is caused by the push.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
