# Explanation 1.5.3 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 95% × 92% × 85% and the current output is that product applied to 1200 cases, which is 891.48 cases.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 46.92, stage 2 48.45, stage 3 52.44 cases.
3. The largest absolute gain is 52.44 cases, so the best stage(s) to improve are 3.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.95 × 0.92 × 0.85 = 0.7429; applied to 1200, this gives 891.48 cases.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 46.92, Stage 2 = 48.45, Stage 3 = 52.44 cases. The maximum occurs at stage(s) 3.

## Result

**Answer.** Current final output: 891.48 cases. Best stage(s) to improve: 3, for a gain of 52.44 cases.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
