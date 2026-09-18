# Explanation 7.7.5 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 92% × 88% × 92% and the current output is that product applied to 1600 service units, which is 1191.73 service units.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 64.77, stage 2 67.71, stage 3 64.77 service units.
3. The largest absolute gain is 67.71 service units, so the best stage(s) to improve are 2.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.92 × 0.88 × 0.92 = 0.7448; applied to 1600, this gives 1191.73 service units.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 64.77, Stage 2 = 67.71, Stage 3 = 64.77 service units. The maximum occurs at stage(s) 2.

## Result

**Answer.** Current final output: 1191.73 service units. Best stage(s) to improve: 2, for a gain of 67.71 service units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
