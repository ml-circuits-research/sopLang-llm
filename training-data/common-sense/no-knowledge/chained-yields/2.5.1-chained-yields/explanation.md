# Explanation 2.5.1 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 82% × 82% × 95% and the current output is that product applied to 1200 units, which is 766.54 units.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 46.74, stage 2 46.74, stage 3 40.34 units.
3. The largest absolute gain is 46.74 units, so the best stage(s) to improve are 1, 2.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.82 × 0.82 × 0.95 = 0.6388; applied to 1200, this gives 766.54 units.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 46.74, Stage 2 = 46.74, Stage 3 = 40.34 units. The maximum occurs at stage(s) 1, 2.

## Result

**Answer.** Current final output: 766.54 units. Best stage(s) to improve: 1, 2, for a gain of 46.74 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
