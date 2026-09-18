# Explanation 4.1.9 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 82% × 82% × 92% and the current output is that product applied to 2400 measurements, which is 1484.66 measurements.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 90.53, stage 2 90.53, stage 3 80.69 measurements.
3. The largest absolute gain is 90.53 measurements, so the best stage(s) to improve are 1, 2.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.82 × 0.82 × 0.92 = 0.6186; applied to 2400, this gives 1484.66 measurements.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 90.53, Stage 2 = 90.53, Stage 3 = 80.69 measurements. The maximum occurs at stage(s) 1, 2.

## Result

**Answer.** Current final output: 1484.66 measurements. Best stage(s) to improve: 1, 2, for a gain of 90.53 measurements.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
