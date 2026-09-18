# Explanation 4.9.5 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 82% × 82% × 82% and the current output is that product applied to 1700 measurements, which is 937.33 measurements.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 57.15, stage 2 57.15, stage 3 57.15 measurements.
3. The largest absolute gain is 57.15 measurements, so the best stage(s) to improve are 1, 2, 3.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.82 × 0.82 × 0.82 = 0.5514; applied to 1700, this gives 937.33 measurements.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 57.15, Stage 2 = 57.15, Stage 3 = 57.15 measurements. The maximum occurs at stage(s) 1, 2, 3.

## Result

**Answer.** Current final output: 937.33 measurements. Best stage(s) to improve: 1, 2, 3, for a gain of 57.15 measurements.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
