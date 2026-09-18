# Explanation 3.2.8 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 90% × 95% × 95% and the current output is that product applied to 1500 participants, which is 1218.38 participants.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 67.69, stage 2 64.12, stage 3 64.12 participants.
3. The largest absolute gain is 67.69 participants, so the best stage(s) to improve are 1.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.90 × 0.95 × 0.95 = 0.8122; applied to 1500, this gives 1218.38 participants.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 67.69, Stage 2 = 64.12, Stage 3 = 64.12 participants. The maximum occurs at stage(s) 1.

## Result

**Answer.** Current final output: 1218.38 participants. Best stage(s) to improve: 1, for a gain of 67.69 participants.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
