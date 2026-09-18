# Explanation 401 — Competing hypotheses

## Explanation

1. The experiment observes “food does not reach the intestine”, so the comparison asks which stated explanation predicts exactly that result.
2. H1: problem is before the intestine predicts it (its predictions are low absorption, food does not reach the intestine, the stomach receives food), so the observation supports that hypothesis in the model.
3. The observation is not among the predictions of H2: the problem is intestinal absorption (low absorption, food reaches the intestine, the preceding digestive path is normal), so the model rules that hypothesis out for this comparison.
4. The conclusion says “better supported in this model”, not “true”: the experiment tested the stated predictions only, and other explanations are not excluded by this evidence alone.

Reference solution as printed in the source (form 16, 4 steps):

1. Before deciding, we compare the observation “food does not reach the intestine” with the predictions of both hypotheses.
2. The observation is predicted by H1: problem is before the intestine.
3. The observation does not appear in the prediction set of H2: the problem is intestinal absorption in the given model; so the observation does not support the second hypothesis in this comparison.
4. We say “is better supported in this model,” not “is the absolute truth,” because the problem tested a limited set of predictions.

## Result

**Answer.** The data support H1: problem is before the intestine and are incompatible with H2: the problem is intestinal absorption in the given model.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
