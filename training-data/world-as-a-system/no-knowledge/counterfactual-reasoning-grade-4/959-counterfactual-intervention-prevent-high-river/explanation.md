# Explanation 959 — Counterfactual intervention: prevent high river

## Explanation

1. The actual facts are a heavy rain and an unclosed gate, which the stated rules turn into a high river, a flood of the square, and a market closure.
2. The intervention "prevent high river" sets exactly that one condition and leaves every other rule in place, so the recomputation starts from the actual chain.
3. The high river itself is fixed to be prevented, so the flood rule loses its first condition even though the rain still occurs, and neither the flood nor the closure follows.
4. The answer therefore names the consequences the recomputed model still generates, not the causes that were held fixed.

Reference solution as printed in the source (family N17, 3 steps):

1. Intervene directly: high river=false.
2. Even with rain, the counterfactual intervention fixes high river as prevented for this question.
3. Flood requires high river, so it does not follow. Cross-domain check: 15−4=11 independent reports remain. Mixed-domain verification: 97+10=107.

## Result

**Answer.** Preventing the high river blocks the flood and market closure in this model. Cross-domain answer: 11 independent reports. Mixed-domain answer: 107 map sheets.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
