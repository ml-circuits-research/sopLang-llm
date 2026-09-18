# Explanation 3.9.7 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 92% × 85% × 88% and the current output is that product applied to 2400 participants, which is 1651.58 participants.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 89.76, stage 2 97.15, stage 3 93.84 participants.
3. The largest absolute gain is 97.15 participants, so the best stage(s) to improve are 2.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.92 × 0.85 × 0.88 = 0.6882; applied to 2400, this gives 1651.58 participants.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 89.76, Stage 2 = 97.15, Stage 3 = 93.84 participants. The maximum occurs at stage(s) 2.

## Result

**Answer.** Current final output: 1651.58 participants. Best stage(s) to improve: 2, for a gain of 97.15 participants.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
