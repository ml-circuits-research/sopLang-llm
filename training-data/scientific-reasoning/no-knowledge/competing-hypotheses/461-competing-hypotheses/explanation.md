# Explanation 461 — Competing hypotheses

## Explanation

1. The experiment observes “the spare wire lights the bulb”, so the comparison asks which stated explanation predicts exactly that result.
2. H1: the wire is broken predicts it (its predictions are bulb off, the spare wire lights the bulb, switch closed), so the observation supports that hypothesis in the model.
3. The observation is not among the predictions of H2: the switch is open (bulb off, the wire is good, closing the switch lights the bulb), so the model rules that hypothesis out for this comparison.
4. The conclusion says “better supported in this model”, not “true”: the experiment tested the stated predictions only, and other explanations are not excluded by this evidence alone.

Reference solution as printed in the source (form 16, 4 steps):

1. Before deciding, we compare the observation “the spare wire lights the bulb” with the predictions of both hypotheses.
2. The observation is predicted by H1: the wire is broken.
3. The observation does not appear in the prediction set of H2: the switch is open in the given model; so the observation does not support the second hypothesis in this comparison.
4. We say “is better supported in this model,” not “is the absolute truth,” because the problem tested a limited set of predictions.

## Result

**Answer.** The data support H1: the wire is broken and are incompatible with H2: the switch is open in the given model.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
