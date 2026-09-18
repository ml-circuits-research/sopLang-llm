# Explanation 2.2.10 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 95% × 85% × 90% and the current output is that product applied to 1500 units, which is 1090.12 units.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 57.38, stage 2 64.12, stage 3 60.56 units.
3. The largest absolute gain is 64.12 units, so the best stage(s) to improve are 2.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.95 × 0.85 × 0.90 = 0.7268; applied to 1500, this gives 1090.12 units.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 57.38, Stage 2 = 64.12, Stage 3 = 60.56 units. The maximum occurs at stage(s) 2.

## Result

**Answer.** Current final output: 1090.12 units. Best stage(s) to improve: 2, for a gain of 64.12 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
