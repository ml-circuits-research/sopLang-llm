# Explanation 5.3.1 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 82% × 88% × 85% and the current output is that product applied to 1900 operations, which is 1165.38 operations.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 71.06, stage 2 66.21, stage 3 68.55 operations.
3. The largest absolute gain is 71.06 operations, so the best stage(s) to improve are 1.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.82 × 0.88 × 0.85 = 0.6134; applied to 1900, this gives 1165.38 operations.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 71.06, Stage 2 = 66.21, Stage 3 = 68.55 operations. The maximum occurs at stage(s) 1.

## Result

**Answer.** Current final output: 1165.38 operations. Best stage(s) to improve: 1, for a gain of 71.06 operations.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
