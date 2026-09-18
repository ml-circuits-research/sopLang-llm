# Explanation 244 — Choosing a discriminating experiment

## Explanation

1. Both hypotheses account for the trouble, so a test that they answer alike cannot separate them; only a prediction one makes and the other refuses can.
2. The first prediction of H1 that H2 does not make is “increasing the portion helps”, and the first prediction of H2 that H1 does not make is “energy at target”.
3. Observing “increasing the portion helps” supports H1: the lack of satiety comes from a portion with too little energy, while observing “energy at target” supports H2: the lack comes from unsuitable composition.
4. The predictions are written down before the test, so the rule is not changed after the result is seen.

Reference solution as printed in the source (form 9, 4 steps):

1. A useful test is not one for which both hypotheses give the same answer.
2. We choose the discriminating observation “increasing the portion helps”: it is predicted by the first hypothesis but not by the second in the model.
3. We can also check the counterprediction “energy at target”, associated with the second hypothesis.
4. after the test, we compare the observed result with the predictions written beforehand; we do not change the rule after seeing the result.

## Result

**Answer.** We test whether “increasing the portion helps” (or “energy at target”). The appearance of the first supports H1: the lack of satiety comes from a portion with too little energy, while the second result supports H2: the lack comes from unsuitable composition.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
