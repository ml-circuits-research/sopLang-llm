# Explanation 10.6.2 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 88% × 95% × 90% and the current output is that product applied to 2100 beneficiaries, which is 1580.04 beneficiaries.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 89.78, stage 2 83.16, stage 3 87.78 beneficiaries.
3. The largest absolute gain is 89.78 beneficiaries, so the best stage(s) to improve are 1.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.88 × 0.95 × 0.90 = 0.7524; applied to 2100, this gives 1580.04 beneficiaries.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 89.78, Stage 2 = 83.16, Stage 3 = 87.78 beneficiaries. The maximum occurs at stage(s) 1.

## Result

**Answer.** Current final output: 1580.04 beneficiaries. Best stage(s) to improve: 1, for a gain of 89.78 beneficiaries.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
