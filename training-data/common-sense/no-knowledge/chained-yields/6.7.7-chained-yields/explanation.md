# Explanation 6.7.7 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 90% × 92% × 90% and the current output is that product applied to 1300 residents, which is 968.76 residents.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 53.82, stage 2 52.65, stage 3 53.82 residents.
3. The largest absolute gain is 53.82 residents, so the best stage(s) to improve are 1, 3.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.90 × 0.92 × 0.90 = 0.7452; applied to 1300, this gives 968.76 residents.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 53.82, Stage 2 = 52.65, Stage 3 = 53.82 residents. The maximum occurs at stage(s) 1, 3.

## Result

**Answer.** Current final output: 968.76 residents. Best stage(s) to improve: 1, 3, for a gain of 53.82 residents.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
