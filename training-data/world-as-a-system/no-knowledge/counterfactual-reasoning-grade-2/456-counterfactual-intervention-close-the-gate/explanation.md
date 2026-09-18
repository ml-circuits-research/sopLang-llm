# Explanation 456 — Counterfactual intervention: close the gate

## Explanation

1. The actual facts are a heavy rain and an unclosed gate, which the stated rules turn into a high river, a flood of the square, and a market closure.
2. The intervention "close the gate" sets exactly that one condition and leaves every other rule in place, so the recomputation starts from the actual chain.
3. The gate is closed, so the flood rule loses its unclosed-gate condition; the high river still follows from the rain, but neither the flood nor the market closure follows.
4. The answer therefore names the consequences the recomputed model still generates, not the causes that were held fixed.

Reference solution as printed in the source (family N17, 4 steps):

1. Actual chain gives high river, then flood, then market closure.
2. Intervene: set gate=closed.
3. The flood rule requires an unclosed gate, so flooding no longer follows.
4. Without flooding, market closure does not follow. Cross-domain check: 3×3=9 km.

## Result

**Answer.** With the gate closed, the model no longer implies flooding or market closure. Cross-domain answer: 9 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
