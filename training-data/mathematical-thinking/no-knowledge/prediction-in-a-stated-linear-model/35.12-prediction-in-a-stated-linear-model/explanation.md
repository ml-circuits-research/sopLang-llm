# Explanation 35.12 — Prediction in a stated linear model

## Explanation

1. The culture starts at 20 units and the stated model adds 3 units every day.
2. Over 4 days the total addition is 3 × 4 = 12 units.
3. Adding that to the start gives 20 + 12 = 32 units.

Reference solution as printed in the source (chapter 35, 4 steps):

1. Each day adds 3.
2. In 4 days, 12 are added.
3. 20+12=32.
4. The prediction is valid within the given constant-rate model.

## Result

**Answer.** 32 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
