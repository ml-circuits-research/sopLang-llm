# Explanation 416 — Competing hypotheses

## Explanation

1. The experiment observes “microbes on hands”, so the comparison asks which stated explanation predicts exactly that result.
2. H1: transmission is through hands predicts it (its predictions are microbes on hands, washing reduces cases, surface is reached), so the observation supports that hypothesis in the model.
3. The observation is not among the predictions of H2: transmission is direct through food (covering of the food reduces cases, the food are exposed, the hands can be clean), so the model rules that hypothesis out for this comparison.
4. The conclusion says “better supported in this model”, not “true”: the experiment tested the stated predictions only, and other explanations are not excluded by this evidence alone.

Reference solution as printed in the source (form 16, 4 steps):

1. Before deciding, we compare the observation “microbes on hands” with the predictions of both hypotheses.
2. The observation is predicted by H1: transmission is through hands.
3. The observation does not appear in the prediction set of H2: transmission is direct through food in the given model; so the observation does not support the second hypothesis in this comparison.
4. We say “is better supported in this model,” not “is the absolute truth,” because the problem tested a limited set of predictions.

## Result

**Answer.** The data support H1: transmission is through hands and are incompatible with H2: transmission is direct through food in the given model.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
