# Explanation 7.6.8 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 92% × 92% × 82% and the current output is that product applied to 1800 service units, which is 1249.29 service units.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 67.9, stage 2 67.9, stage 3 76.18 service units.
3. The largest absolute gain is 76.18 service units, so the best stage(s) to improve are 3.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.92 × 0.92 × 0.82 = 0.6940; applied to 1800, this gives 1249.29 service units.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 67.9, Stage 2 = 67.9, Stage 3 = 76.18 service units. The maximum occurs at stage(s) 3.

## Result

**Answer.** Current final output: 1249.29 service units. Best stage(s) to improve: 3, for a gain of 76.18 service units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
