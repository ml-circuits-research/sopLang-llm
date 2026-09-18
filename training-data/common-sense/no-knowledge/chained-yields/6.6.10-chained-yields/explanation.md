# Explanation 6.6.10 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 90% × 90% × 85% and the current output is that product applied to 2300 residents, which is 1583.55 residents.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 87.97, stage 2 87.97, stage 3 93.15 residents.
3. The largest absolute gain is 93.15 residents, so the best stage(s) to improve are 3.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.90 × 0.90 × 0.85 = 0.6885; applied to 2300, this gives 1583.55 residents.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 87.97, Stage 2 = 87.98, Stage 3 = 93.15 residents. The maximum occurs at stage(s) 3.

## Result

**Answer.** Current final output: 1583.55 residents. Best stage(s) to improve: 3, for a gain of 93.15 residents.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
