# Explanation 8.7.3 — Chained yields

## Explanation

1. Retention multiplies along the chain, so the overall retention is 92% × 90% × 92% and the current output is that product applied to 1100 documents, which is 837.94 documents.
2. Raising one stage by 5 percentage points keeps the other two rates fixed; the resulting absolute gains are stage 1 45.54, stage 2 46.55, stage 3 45.54 documents.
3. The largest absolute gain is 46.55 documents, so the best stage(s) to improve are 2.
4. The gain from a stage is proportional to the retention of the other two stages, so a stage's own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.

Reference solution as printed in the source (template 15, 3 steps):

1. Overall retention = 0.92 × 0.90 × 0.92 = 0.7618; applied to 1100, this gives 837.94 documents.
2. For each candidate, increase only that stage by 0.05 and keep the other two rates fixed.
3. Absolute gains are: Stage 1 = 45.54, Stage 2 = 46.55, Stage 3 = 45.54 documents. The maximum occurs at stage(s) 2.

## Result

**Answer.** Current final output: 837.94 documents. Best stage(s) to improve: 2, for a gain of 46.55 documents.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
