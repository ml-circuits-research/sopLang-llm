# Explanation 6.8.4 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 92% × 82% × 90% and the current output is that product applied to 1200 residents, which is 814.75 residents.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 44.28, stage 2 49.68, stage 3 45.26 residents.
3. The largest absolute gain is 49.68 residents, so the best stage(s) to improve are 2.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.92 × 0.82 × 0.90 = 0.6790; applied to 1200, this gives 814.75 residents.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 44.28, Stage 2 = 49.68, Stage 3 = 45.26 residents. The maximum occurs at stage(s) 2.

## Result

**Answer.** Current final output: 814.75 residents. Best stage(s) to improve: 2, for a gain of 49.68 residents.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
