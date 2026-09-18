# Explanation 441 — Competing hypotheses

## Explanation

1. The experiment observes “screen aligned”, so the comparison asks which stated explanation predicts exactly that result.
2. H1: the shadow is missing because of the object transparent predicts it (its predictions are screen aligned, light passes through object, source lit), so the observation supports that hypothesis in the model.
3. The observation is not among the predictions of H2: the shadow is missing because of the screen (the screen is not behind the object, opaque object, source lit), so the model rules that hypothesis out for this comparison.
4. The conclusion says “better supported in this model”, not “true”: the experiment tested the stated predictions only, and other explanations are not excluded by this evidence alone.

Reference solution as printed in the source (form 16, 4 steps):

1. Before deciding, we compare the observation “screen aligned” with the predictions of both hypotheses.
2. The observation is predicted by H1: the shadow is missing because of the object transparent.
3. The observation does not appear in the prediction set of H2: the shadow is missing because of the screen in the given model; so the observation does not support the second hypothesis in this comparison.
4. We say “is better supported in this model,” not “is the absolute truth,” because the problem tested a limited set of predictions.

## Result

**Answer.** The data support H1: the shadow is missing because of the object transparent and are incompatible with H2: the shadow is missing because of the screen in the given model.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
