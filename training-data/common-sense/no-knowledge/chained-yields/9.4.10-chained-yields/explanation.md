# Explanation 9.4.10 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 88% × 92% × 92% and the current output is that product applied to 2300 uses, which is 1713.11 uses.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 97.34, stage 2 93.1, stage 3 93.1 uses.
3. The largest absolute gain is 97.34 uses, so the best stage(s) to improve are 1.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.88 × 0.92 × 0.92 = 0.7448; applied to 2300, this gives 1713.11 uses.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 97.34, Stage 2 = 93.1, Stage 3 = 93.1 uses. The maximum occurs at stage(s) 1.

## Result

**Answer.** Current final output: 1713.11 uses. Best stage(s) to improve: 1, for a gain of 97.34 uses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
